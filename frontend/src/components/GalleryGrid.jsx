import React from "react";
import ArtworkCard from "./ArtworkCard";

// أضفنا isAdmin و onDelete كدعائم (Props) لتمريرها للبطاقات
export default function GalleryGrid({ artworks, loading, isAdmin, onDelete }) {
  
  // 1. حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        {/* أضفنا نصاً بجانب الأيقونة لتحسين تجربة المستخدم */}
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 animate-pulse">جاري جلب اللوحات الفنية...</p>
        </div>
      </div>
    );
  }

  // 2. حالة عدم وجود أعمال فنية
  if (artworks.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mx-4">
        <div className="text-5xl mb-4">🎨</div>
        <p className="text-lg font-semibold text-gray-600">لا توجد أعمال فنية حالياً</p>
        <p className="text-gray-400">ابدأ بإضافة أعمالك المتميزة إلى المعرض.</p>
      </div>
    );
  }

  // 3. عرض شبكة الأعمال الفنية
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {artworks.map((artwork) => (
        <ArtworkCard 
          key={artwork.id} 
          artwork={artwork} 
          isAdmin={isAdmin} // تمرير خاصية الإدارة لكل بطاقة
          onDelete={onDelete} // تمرير دالة الحذف لكل بطاقة
        />
      ))}
    </div>
  );
}
