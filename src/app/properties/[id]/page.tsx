{/* ✅✅✅ قسم الزوار - للأعضاء المسجلين */}
{!isAdmin && (
  <div className="space-y-4 mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-teal-900/30 rounded-xl border border-blue-700/50">
    <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
      🤝 هل أنت مهتم بهذا العقار؟
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* زر طلب زيارة */}
      <button
        onClick={() => openInquiryModal('زيارة')}
        className="flex flex-col items-center gap-2 p-4 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-xl transition"
      >
        <span className="text-3xl">📞</span>
        <span className="text-sm font-medium text-blue-300">طلب زيارة</span>
        <span className="text-xs text-blue-400/70">أريد معاينة العقار</span>
      </button>

      {/* زر الشراء */}
      <button
        onClick={() => openInquiryModal('شراء')}
        className="flex flex-col items-center gap-2 p-4 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 rounded-xl transition"
      >
        <span className="text-3xl">🛒</span>
        <span className="text-sm font-medium text-emerald-300">أرغب بالشراء</span>
        <span className="text-xs text-emerald-400/70">أريد شراء هذا العقار</span>
      </button>

      {/* زر الكراء */}
      <button
        onClick={() => openInquiryModal('كراء')}
        className="flex flex-col items-center gap-2 p-4 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded-xl transition"
      >
        <span className="text-3xl">🔑</span>
        <span className="text-sm font-medium text-purple-300">أرغب بالكراء</span>
        <span className="text-xs text-purple-400/70">أريد استئجار هذا العقار</span>
      </button>
    </div>
  </div>
)}
