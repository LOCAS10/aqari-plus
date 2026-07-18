import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { FEE_AMOUNTS, Payment } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured', payments: [] },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const clientId = searchParams.get('clientId');

    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    let payments: Payment[] = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Payment[];

    if (month) {
      payments = payments.filter((p) => p.month === parseInt(month, 10));
    }
    if (year) {
      payments = payments.filter((p) => p.year === parseInt(year, 10));
    }
    if (clientId) {
      payments = payments.filter((p) => p.clientId === clientId);
    }

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { clientId, month, year, paymentDate, paymentMethod, notes, receiptImage } = body;

    // Validation
    if (!clientId || typeof clientId !== 'string' || !clientId.trim()) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      );
    }

    if (month === undefined || month === null || typeof month !== 'number' || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'month is required and must be between 1 and 12' },
        { status: 400 }
      );
    }

    if (year === undefined || year === null || typeof year !== 'number' || year < 2020 || year > 2100) {
      return NextResponse.json(
        { error: 'year is required and must be between 2020 and 2100' },
        { status: 400 }
      );
    }

    if (!paymentDate || typeof paymentDate !== 'string' || !paymentDate.trim()) {
      return NextResponse.json(
        { error: 'paymentDate is required' },
        { status: 400 }
      );
    }

    // Fetch client
    const clientRef = doc(db, 'clients', clientId);
    const clientSnap = await getDoc(clientRef);

    if (!clientSnap.exists()) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const clientData = clientSnap.data();
    const clientName = clientData.name;
    const clientApartment = clientData.apartmentNumber;
    const clientPropertyType = clientData.propertyType as 'apartment' | 'shop';
    const amount = FEE_AMOUNTS[clientPropertyType];

    const id = doc(collection(db, 'payments')).id;
    const operationNumber = `OP-${Date.now()}`;

    const paymentData: Record<string, unknown> = {
      operationNumber,
      clientId,
      clientName,
      clientApartment,
      clientPropertyType,
      amount,
      month,
      year,
      paymentDate,
      paymentMethod: paymentMethod || 'cash',
      createdAt: new Date().toISOString(),
    };

    if (notes?.trim()) paymentData.notes = notes.trim();
    if (receiptImage) paymentData.receiptImage = receiptImage;

    await addDoc(collection(db, 'payments'), paymentData);

    const newPayment = { id, ...paymentData };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}