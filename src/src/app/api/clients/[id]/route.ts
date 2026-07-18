import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Client } from '@/lib/types';

type RouteParams = Promise<{ id: string }>;

// GET /api/clients/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 },
      );
    }

    const { id } = await params;
    const docRef = doc(db, 'clients', id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { id: snapshot.id, ...snapshot.data() } as Client,
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 },
    );
  }
}

// PUT /api/clients/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate if name or apartmentNumber are provided
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) {
        return NextResponse.json(
          { error: 'Name cannot be empty' },
          { status: 400 },
        );
      }
      body.name = name;
    }

    if (body.apartmentNumber !== undefined) {
      const apartmentNumber = String(body.apartmentNumber).trim();
      if (!apartmentNumber) {
        return NextResponse.json(
          { error: 'Apartment number cannot be empty' },
          { status: 400 },
        );
      }
      body.apartmentNumber = apartmentNumber;
    }

    const docRef = doc(db, 'clients', id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 },
      );
    }

    const updates: Record<string, unknown> = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    delete (updates as Record<string, unknown>).id;

    await updateDoc(docRef, updates);

    const updated = {
      id,
      ...snapshot.data(),
      ...updates,
    } as Client;

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 },
    );
  }
}

// DELETE /api/clients/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: RouteParams },
) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 },
      );
    }

    const { id } = await params;

    // Cascade delete related payments
    const paymentsRef = collection(db, 'payments');
    const paymentsQuery = query(paymentsRef, where('clientId', '==', id));
    const paymentsSnapshot = await getDocs(paymentsQuery);

    const paymentBatches: string[][] = [[]];
    paymentsSnapshot.docs.forEach((d) => {
      if (paymentBatches[paymentBatches.length - 1].length >= 500) {
        paymentBatches.push([]);
      }
      paymentBatches[paymentBatches.length - 1].push(d.id);
    });

    for (const batchIds of paymentBatches) {
      if (batchIds.length === 0) continue;
      const batch = writeBatch(db);
      for (const docId of batchIds) {
        batch.delete(doc(db, 'payments', docId));
      }
      await batch.commit();
    }

    // Cascade delete related deliveries
    const deliveriesRef = collection(db, 'deliveries');
    const deliveriesQuery = query(deliveriesRef, where('clientId', '==', id));
    const deliveriesSnapshot = await getDocs(deliveriesQuery);

    const deliveryBatches: string[][] = [[]];
    deliveriesSnapshot.docs.forEach((d) => {
      if (deliveryBatches[deliveryBatches.length - 1].length >= 500) {
        deliveryBatches.push([]);
      }
      deliveryBatches[deliveryBatches.length - 1].push(d.id);
    });

    for (const batchIds of deliveryBatches) {
      if (batchIds.length === 0) continue;
      const batch = writeBatch(db);
      for (const docId of batchIds) {
        batch.delete(doc(db, 'deliveries', docId));
      }
      await batch.commit();
    }

    // Delete the client document
    await deleteDoc(doc(db, 'clients', id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 },
    );
  }
}