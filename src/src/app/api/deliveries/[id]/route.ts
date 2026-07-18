import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

// GET /api/deliveries/[id]
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

    const docRef = doc(db, 'deliveries', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    return NextResponse.json({ id: snap.id, ...snap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch delivery' },
      { status: 500 }
    );
  }
}

// PUT /api/deliveries/[id]
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

    // Only allow these mutable fields
    const allowedFields = ['amount', 'deliveryDate', 'description', 'notes', 'receiptImage'];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    // Validate amount if provided
    if ('amount' in updates) {
      if (typeof updates.amount !== 'number' || updates.amount <= 0) {
        return NextResponse.json(
          { error: 'amount must be a positive number' },
          { status: 400 }
        );
      }
    }

    const docRef = doc(db, 'deliveries', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    await updateDoc(docRef, updates);

    const updatedSnap = await getDoc(docRef);
    return NextResponse.json({ id: updatedSnap.id, ...updatedSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update delivery' },
      { status: 500 }
    );
  }
}

// DELETE /api/deliveries/[id]
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

    const docRef = doc(db, 'deliveries', id);
    await deleteDoc(docRef);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete delivery' },
      { status: 500 }
    );
  }
}