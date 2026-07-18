import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Client, ClientInput } from '@/lib/types';

// GET /api/clients?search=...
export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured', clients: [] },
        { status: 200 },
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';

    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    let clients: Client[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Client[];

    if (search) {
      clients = clients.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.phone?.toLowerCase().includes(search) ||
          c.apartmentNumber?.toLowerCase().includes(search),
      );
    }

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 },
    );
  }
}

// POST /api/clients
export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Partial<ClientInput>;

    const name = body.name?.trim() || '';
    const apartmentNumber = body.apartmentNumber?.trim() || '';

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 },
      );
    }

    if (!apartmentNumber) {
      return NextResponse.json(
        { error: 'Apartment number is required' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const id = doc(collection(db, 'clients')).id;

    const clientData: Record<string, unknown> = {
      id,
      name,
      phone: body.phone?.trim() || '',
      apartmentNumber,
      propertyType: body.propertyType || 'apartment',
      createdAt: now,
      updatedAt: now,
    };

    if (body.floor?.trim()) clientData.floor = body.floor.trim();
    if (body.notes?.trim()) clientData.notes = body.notes.trim();

    const client: Client = clientData as unknown as Client;
    const { id: _id, ...docPayload } = clientData;
    await addDoc(collection(db, 'clients'), docPayload);

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 },
    );
  }
}