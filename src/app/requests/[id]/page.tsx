
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import RequestDetailClient from './RequestDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  const tokenCookie = cookieStore.get('auth-token') || cookieStore.get('token') || cookieStore.get('session');

  if (!userCookie && !tokenCookie) {
    redirect(`/login?redirect=/requests/${id}`);
  }

  try {
    const docRef = doc(db, 'requests', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center p-8">
            <div className="text-7xl mb-4">😔</div>
            <h1 className="text-3xl font-bold text-white mb-3">الطلب غير موجود</h1>
            <Link href="/requests" className="inline-block px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600">← العودة</Link>
          </div>
        </div>
      );
    }

    const requestData = { id: docSnap.id, ...docSnap.data() };
    return <RequestDetailClient request={requestData} />;
    
  } catch (e) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center p-8">
          <div className="text-7xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-3">حدث خطأ</h1>
          <Link href="/requests" className="inline-block px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600">← العودة</Link>
        </div>
      </div>
    );
  }
}
EOF
