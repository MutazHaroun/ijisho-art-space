import React, { useState } from "react"; // أضفنا useState لمراقبة تحميل الصورة
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkCard({ artwork, isAdmin, onDelete }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x300?text=No+Image";

    if (typeof path === 'string' && path.includes(":5001")) {
      const fileName = path.split("/uploads/")[1];
      return `${API_URL}/uploads/${fileName}`;
    }

    if (path.startsWith("http") && !path.includes("localhost")) return path;
    
    let cleanPath = path;
    if (!path.startsWith("/uploads") && !path.startsWith("uploads")) {
      cleanPath = `/uploads/${path.replace(/^\//, "")}`;
    }

    const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `${API_URL}${finalPath}`;
  };

  const imageSrc = getFullImageUrl(artwork.image_url);

  return (
    <div className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* 1. تأثير الحذف (يظهر فقط للأدمن) */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault(); // لمنع الانتقال لصفحة التفاصيل عند الضغط على حذف
            onDelete(artwork.id);
          }}
          className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
          title="حذف العمل"
        >
          🗑️
        </button>
      )}

      <Link to={`/gallery/${artwork.id}`} className="block">
        {/* 2. حاوية الصورة مع Skeleton Loader */}
        <div className={`relative aspect-[4/3] overflow-hidden ${!imageLoaded ? 'animate-pulse bg-gray-200' : 'bg-gray-100'}`}>
          <img
            src={imageSrc}
            alt={artwork.title}
            onLoad={() => setImageLoaded(true)} // تفعيل عند انتهاء التحميل
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/400x300?text=Image+Not+Found"; 
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } group-hover:scale-110`}
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
              {artwork.title}
            </h3>
            {artwork.price && (
              <span className="text-blue-700 font-extrabold text-md whitespace-nowrap">
                ${Number(artwork.price).toLocaleString()}
              </span>
            )}
          </div>
          
          {artwork.artist && (
            <p className="text-sm text-gray-500 mt-1 italic">بواسطة {artwork.artist}</p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className={`text-[10px] uppercase tracking-tighter font-black px-2 py-1 rounded shadow-sm ${
              artwork.category === "Art" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-orange-50 text-orange-600 border border-orange-100"
            }`}>
              {artwork.category}
            </span>
            
            <span className={`flex items-center text-xs font-bold ${
              artwork.status === "Available" ? "text-green-600" : "text-red-500"
            }`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 animate-pulse ${
                artwork.status === "Available" ? "bg-green-500" : "bg-red-500"
              }`}></span>
              {artwork.status}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
