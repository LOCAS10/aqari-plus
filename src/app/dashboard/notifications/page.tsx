"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import Link from "next/link";
import { getNotifications, markAsRead } from "@/lib/notifications";
import { InquiryNotification } from "@/lib/notifications";

export default function NotificationsPage() {
  const { state } = useAppContext();
  const [notifications, setNotifications] = useState<InquiryNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setLoading(false);
  }, []);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          🔔 الإشعارات
          <span className="text-sm font-normal bg-red-500 text-white px-3 py-1 rounded-full text-xs">
            {notifications.filter(n => !n.read).length} جديد
          </span>
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-bounce">📭</div>
          <p className="text-gray-400">جاري تحميل الإشعارات...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-400 mb-2">لا توجد إشعارات بعد</p>
          <p className="text-sm text-gray-500 mt-2">
            ستظهر هنا الإشعارات عندما يرسل زائر استفسار عن عقار
          </p>
          <Link 
            href="/properties"
            className="text-emerald-400 underline mt-4 inline-block"
          >
            تصفح العقارات ←
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-6 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${
                !notif.read 
                  ? 'bg-slate-800 border-emerald-500/30 hover:bg-emerald-900/20 shadow-lg' 
                  : 'bg-slate-800/50 border-slate-700 opacity-60'
              }`}
              onClick={() => handleMarkAsRead(notif.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {/* ✅✅✅ تم الإصلاح هنا - استخدام inquiryType بدلاً من type */}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    notif.inquiryType === 'زيارة' ? 'bg-blue-500 text-white' :
                    notif.inquiryType === 'شراء' ? 'bg-emerald-500 text-white' :
                    notif.inquiryType === 'كراء' ? 'bg-purple-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {notif.inquiryType === 'زيارة' ? '📞' : 
                       notif.inquiryType === 'شراء' ? '🛒' : '🔑'}
                  </span>
                  <span className="text-white font-semibold">{notif.propertyTitle}</span>
                </div>

                {!notif.read && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">جديد</span>
                )}
              </div>

              {/* معلومات الزائر */}
              <div className="text-sm text-gray-300 space-y-1">
                <p>👤 من: <span className="text-white font-medium">{notif.clientName}</span></p>
                <p>📱 الهاتف: <span dir="ltr" className="text-emerald-400 font-mono">{notif.clientPhone}</span></p>
                
                <p>💬 نوع الطلب: <span className="font-medium text-blue-300">{notif.inquiryType}</span></p>
                
                <p>🏠 العقار: <span className="text-yellow-300">{notif.propertyTitle}</span></p>
                
                {notif.notes && (
                  <div className="mt-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <p className="text-gray-300 text-sm italic">💬 "{notif.notes}"</p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>⏰</span>
                  <span>{new Date(notif.createdAt).toLocaleDateString('ar-MA')}</span>
                  <span>-</span>
                  <span>{new Date(notif.createdAt).toLocaleTimeString('ar-MA')}</span>
                </p>
              </div>

              {/* زر علام كمقروء */}
              {!notif.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notif.id);
                  }}
                  className="mt-3 w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02]"
                >
                  ✅ علام كمقروء
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
