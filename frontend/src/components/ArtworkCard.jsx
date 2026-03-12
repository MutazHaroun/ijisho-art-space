import React from "react";
import { Link } from "react-router-dom";

// 1. يفضل وضع الرابط في ملف إعدادات منفصل، لكن سنبقيه هنا للتبسيط
// تأكد هل هو 5000 أم 5001 كما ظهر في الصورة؟
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkCard({ artwork }) {
  
  // 2. بناء رابط الصورة بطريقة آمنة
  // نتحقق إذا كان المسار يبدأ بـ http (رابط خارجي) أو يحتاج إضافة رابط السيرفر
  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x300?text=No+Image";
    if (path.startsWith("http")) return path;
    
    // التأكد من عدم وجود // مزدوجة
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  const imageSrc = getFullImageUrl(artwork.image_url);

  return (
    <Link
      to={`/gallery/${artwork.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageSrc}
          alt={artwork.title}
          // onerror: إذا فشل تحميل الصورة من السيرفر، تظهر صورة افتراضية
          onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Error+Loading"; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
          {artwork.title}
        </h3>
        
        {artwork.artist && (
          <p className="text-sm text-gray-500 mt-1">by {artwork.artist}</p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            artwork.category === "Art" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
          }`}>
            {artwork.category}
          </span>
          <span className={`text-xs font-medium ${
            artwork.status === "Available" ? "text-green-600" : "text-red-500"
          }`}>
            {artwork.status}
          </span>
        </div>

        {artwork.price && (
          <p className="mt-2 text-primary-700 font-bold">
            ${Number(artwork.price).toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  );
}
