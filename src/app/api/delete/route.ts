import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionName, id } = body;

    if (!collectionName || !id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Method 1: Direct DocID
    let docRef = doc(db, collectionName, id);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { deleted: true, deletedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, method: 'doc-id', id });
    }

    // Method 2: WHERE query on id field
    const q = query(collection(db, collectionName), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const foundDoc = querySnapshot.docs[0];
      await updateDoc(foundDoc.ref, { deleted: true, deletedAt: new Date().toISOString() });
      return NextResponse.json({ success: true, method: 'where-query', firestoreId: foundDoc.id });
    }

    // Method 3: Brute force
    const allDocs = await getDocs(collection(db, collectionName));
    for (const d of allDocs.docs) {
      const data = d.data();
      if (String(data.id) === String(id)) {
        await updateDoc(d.ref, { deleted: true, deletedAt: new Date().toISOString() });
        return NextResponse.json({ success: true, method: 'brute-force', firestoreId: d.id });
      }
    }

    return NextResponse.json({ error: 'Document not found', searchedId: id }, { status: 404 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API v5 Active!', version: 5 });
}