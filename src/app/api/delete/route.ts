import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  console.log('🗑️🗑️🗑️ API DELETE CALLED!');
  
  try {
    const body = await request.json();
    const { collectionName, id } = body;

    console.log('📥 Received data:', { collectionName, id });

    if (!collectionName || !id) {
      console.log('❌ Missing fields');
      return NextResponse.json({ error: 'Missing collectionName or id' }, { status: 400 });
    }

    // ✅ البحث المباشر بالـ ID
    console.log('🔍 Trying direct ID lookup:', id);
    
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('✅✅✅ FOUND! Document exists!');
      console.log('📄 Document data:', docSnap.data());
      
      await updateDoc(docRef, {
        deleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: 'admin-api-v2',
      });
      
      console.log('🎉🎉🎉 DELETE SUCCESSFUL!');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Document soft-deleted successfully',
        id: id,
        method: 'direct-id',
        timestamp: new Date().toISOString(),
      });
    }

    // ❌ لم يجده - عرض التصحيح
    console.log('❌ Not found by ID, showing debug info...');
    
    try {
      const allDocs = await getDocs(collection(db, collectionName));
      console.log(`📊 Found ${allDocs.size} documents in ${collectionName}`);
      
      let count = 0;
      allDocs.forEach((d) => {
        if (count < 5) {
          console.log(`📄 Doc ${count + 1}:`, { id: d.id, data: d.data() });
        }
        count++;
      });
      
    } catch (e) {
      console.error('⚠️ Could not list documents:', e);
    }

    return NextResponse.json({ 
      error: 'Document not found',
      searchedId: id,
      collectionName: collectionName,
      debugInfo: {
        receivedId: id,
        idType: typeof id,
        idLength: id?.length,
      },
    }, { status: 404 });

  } catch (error: any) {
    console.error('💥💥💥 CRITICAL ERROR:', error);
    return NextResponse.json({ 
      error: error.message || 'Unknown error',
      stack: error.stack,
    }, { status: 500 });
  }
}

// ✅ GET للاختبار
export async function GET() {
  return NextResponse.json({ 
    message: 'API Delete endpoint is working!',
    method: 'POST required',
    timestamp: new Date().toISOString(),
  });
}
