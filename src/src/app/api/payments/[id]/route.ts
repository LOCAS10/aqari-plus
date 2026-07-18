import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Payment } from '@/lib/types';

// Allowed fields for PUT updates
const ALLOWED_UPDATE_FIELDS = ['month', 'year', 'paymentDate', 'notes', 'receiptImage'];
const PROTECTED_FIELDS = ['clientId', 'operationNumber', 'amount', 'clientName', 'clientApartment', 'clientPropertyType'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const paymentRef = doc(db, 'payments', id);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const payment: Payment = {
      id: paymentSnap.id,
      ...paymentSnap.data(),
    } as Payment;

    return NextResponse.json(payment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check for protected fields
    for (const field of PROTECTED_FIELDS) {
      if (field in body) {
        return NextResponse.json(
          { error: `Field "${field}" cannot be modified` },
          { status: 400 }
        );
      }
    }

    // Validate month if provided
    if ('month' in body && (typeof body.month !== 'number' || body.month < 1 || body.month > 12)) {
      return NextResponse.json(
        { error: 'month must be between 1 and 12' },
        { status: 400 }
      );
    }

    // Validate year if provided
    if ('year' in body && (typeof body.year !== 'number' || body.year < 2020 || body.year > 2100)) {
      return NextResponse.json(
        { error: 'year must be between 2020 and 2100' },
        { status: 400 }
      );
    }

    // Fetch existing payment
    const paymentRef = doc(db, 'payments', id);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const existingPayment = paymentSnap.data();
    const newMonth = 'month' in body ? body.month : existingPayment.month;
    const newYear = 'year' in body ? body.year : existingPayment.year;

    // If month or year is changing, check for conflict
    if ('month' in body || 'year' in body) {
      if (newMonth !== existingPayment.month || newYear !== existingPayment.year) {
        const conflictQuery = query(
          collection(db, 'payments'),
          where('clientId', '==', existingPayment.clientId),
          where('month', '==', newMonth),
          where('year', '==', newYear)
        );
        const conflictSnapshot = await getDocs(conflictQuery);

        // Check if any existing payment (other than this one) has same month/year/client
        const hasConflict = conflictSnapshot.docs.some(
          (d) => d.id !== id
        );

        if (hasConflict) {
          return NextResponse.json(
            { error: 'A payment already exists for this client in the specified month and year' },
            { status: 409 }
          );
        }
      }
    }

    // Build update payload with only allowed fields
    const updateData: Record<string, unknown> = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    await updateDoc(paymentRef, updateData);

    // Return updated payment
    const updatedSnap = await getDoc(paymentRef);
    const updatedPayment: Payment = {
      id: updatedSnap.id,
      ...updatedSnap.data(),
    } as Payment;

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const paymentRef = doc(db, 'payments', id);
    await deleteDoc(paymentRef);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
}