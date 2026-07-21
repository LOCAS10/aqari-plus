import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionName, id } = body;

    console.log('🗑️ API Delete:', { collectionName, id });

    if (!collectionName || !id) {
      return NextResponse.json({ error: 'Missing collectionName or id' }, { status: 400 });
    }

    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    await updateDoc(docRef, {
      deleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: 'admin-api',
    });

    console.log('✅ Delete successful!');

    return NextResponse.json({ success: true, message: 'Deleted', id });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
