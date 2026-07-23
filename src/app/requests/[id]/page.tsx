import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getRequestById } from '@/lib/firestore';
import RequestDetailClient from './RequestDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params;

  // ==========================================
  // 🔒 Server-Side Authentication Check
  // ==========================================
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  const tokenCookie = cookieStore.get('auth-token') || cookieStore.get('token');

  if (!userCookie && !tokenCookie) {
    redirect(`/login?redirect=/requests/${id}`);
  }

  // ==========================================
  // ✅ جلب بيانات الطلب
  // ==========================================
  try {
    const request = await getRequestById(id);

    if (!request) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="text-center p-8">
            <div className="text-7xl mb-4">😔</div>
            <h1 className="text-3xl font-bold text-white mb-3">الطلب غير موجود</h1>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              قد يكون هذا الطلب قد تم حذفه أو الرابط غير صحيح
            </p>
            <a 
              href="/requests" 
              className="inline-block px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold 
                       hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/40"
            >
              ← العودة للطلبات
            </a>
          </div>
        </div>
      );
    }

    return <RequestDetailClient request={request} />;
    
  } catch (error) {
    console.error('Error fetching request:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center p-8">
          <div className="text-7xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-white mb-3">حدث خطأ</h1>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            لم نتمكن من تحميل بيانات الطلب، يرجى المحاولة مرة أخرى
          </p>
          <a 
            href="/requests" 
            className="inline-block px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold 
                     hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/40"
          >
            ← العودة للطلبات
          </a>
        </div>
      </div>
    );
  }
}
