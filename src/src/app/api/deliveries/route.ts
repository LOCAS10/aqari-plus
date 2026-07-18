import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDocs, getDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { DeliveryInput } from '@/lib/types';

// GET /api/deliveries
export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured', deliveries: [] },
        { status: 200 }
      );
    }

    const { searchParams } = request.nextUrl;
    const clientId = searchParams.get('clientId');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const q = query(collection(db, 'deliveries'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    let deliveries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Apply filters client-side
    if (clientId) {
      deliveries = deliveries.filter((d) => d.clientId === clientId);
    }

    if (month) {
      const monthNum = parseInt(month, 10);
      if (!isNaN(monthNum)) {
        deliveries = deliveries.filter((d) => {
          const date = new Date(d.deliveryDate);
          return date.getMonth() + 1 === monthNum;
        });
      }
    }

    if (year) {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        deliveries = deliveries.filter((d) => {
          const date = new Date(d.deliveryDate);
          return date.getFullYear() === yearNum;
        });
      }
    }

    return NextResponse.json(deliveries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}

// POST /api/deliveries
export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      );
    }

    const body = (await request.json()) as DeliveryInput & { notes?: string; receiptImage?: string };

    const { clientId, amount, deliveryDate, description, notes, receiptImage } = body;

    // Validation
    if (!clientId || typeof clientId !== 'string' || clientId.trim() === '') {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
    }

    if (!deliveryDate || typeof deliveryDate !== 'string' || deliveryDate.trim() === '') {
      return NextResponse.json({ error: 'deliveryDate is required' }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return NextResponse.json({ error: 'description is required' }, { status: 400 });
    }

    // Fetch client for denormalization
    const clientRef = doc(db, 'clients', clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const clientData = clientSnap.data();

    const id = doc(collection(db, 'deliveries')).id;

    const deliveryData: Record<string, unknown> = {
      clientId,
      clientName: clientData.name || '',
      clientApartment: clientData.apartmentNumber || '',
      clientPropertyType: clientData.propertyType || '',
      amount,
      deliveryDate,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    if (notes?.trim()) deliveryData.notes = notes.trim();
    if (receiptImage) deliveryData.receiptImage = receiptImage;

    await addDoc(collection(db, 'deliveries'), deliveryData);

    const delivery = { id, ...deliveryData };

    return NextResponse.json(delivery, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create delivery' },
      { status: 500 }
    );
  }
}