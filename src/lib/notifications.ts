// src/lib/notifications.ts

export interface InquiryNotification {
  id: string;
  type: 'inquiry' | 'new_property' | 'new_client';
  clientName: string;
  clientPhone: string;
  inquiryType: string; // زيارة / شراء / كراء
  propertyTitle: string;
  propertyCity: string;
  notes: string;
  createdAt: Date;
  read: boolean;
}

// ✅✅✅ حفظ الإشعار (سنحفظه لاحقاًاً في لوحة التحكم)
const notifications: InquiryNotification[] = [];

export function addNotification(notif: InquiryNotification) {
  notifications.unshift({
    ...notif,
    id: Date.now().toString(),
    read: false,
    createdAt: new Date(),
  });
  
  // ✅ حفظ في localStorage مؤقتاً (سننقلها لاحقاًاً لـ Firebase)
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aqari_notifications');
    const allNotifs = saved ? JSON.parse(saved) : [];
    allNotifs.unshift(notif);
    localStorage.setItem('aqari_notifications', JSON.stringify(allNotifs.slice(0, 50))); // آخر 50 إشعار
  }
  
  console.log('💾 تم حفظ الإشعار:', notif);
  return notif;
}

// ✅✅✅ جلب جميع الإشعارات
export function getNotifications(): InquiryNotification[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aqari_notifications');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
}

// ✅✅✅ علام إشعار كمقروء
export function markAsRead(id: string) {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aqari_notifications');
    if (saved) {
      const allNotifs = JSON.parse(saved);
      const notif = allNotifs.find((n) => n.id === id);
      if (notif) {
        notif.read = true;
        localStorage.setItem('aqari_notifications', JSON.stringify(allNotifs));
      }
    }
  }
}
