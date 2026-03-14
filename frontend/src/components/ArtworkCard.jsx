import React, { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkCard({ artwork, isAdmin, onDelete }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x300?text=No+Image";

    if (typeof path === "string" && path.includes(":5001")) {
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
    <>
      <div className="relative group bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(artwork.id);
            }}
            className="absolute top-3 right-3 z-20 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            title="Delete artwork"
          >
            🗑️
          </button>
        )}

        {!isAdmin && (
          <div className="absolute top-3 right-3 z-20">
            <FavoriteButton artworkId={artwork.id} />
          </div>
        )}

        <div
          className={`relative aspect-[4/3] overflow-hidden ${
            !imageLoaded ? "animate-pulse bg-gray-200 dark:bg-gray-800" : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <img
            src={imageSrc}
            alt={artwork.title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/400x300?text=Image+Not+Found";
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
            } group-hover:scale-110`}
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreviewOpen(true);
            }}
            className="absolute bottom-3 left-3 z-20 px-4 py-2 rounded-xl bg-white/90 text-[#0b1120] text-xs font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          >
            Quick View
          </button>
        </div>

        <Link to={`/gallery/${artwork.id}`} className="block">
          <div className="p-5">
            <div className="flex justify-between items-start gap-3">
              <h3 className="text-lg font-black text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                {artwork.title}
              </h3>

              {artwork.price && (
                <span className="text-blue-700 dark:text-blue-400 font-extrabold text-sm whitespace-nowrap">
                  ${Number(artwork.price).toLocaleString()}
                </span>
              )}
            </div>

            {artwork.artist && (
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 italic line-clamp-1">
                BY {artwork.artist}
              </p>
            )}

            {artwork.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                {artwork.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full shadow-sm ${
                  artwork.category === "Art"
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "bg-orange-50 text-orange-600 border border-orange-100"
                }`}
              >
                {artwork.category}
              </span>

              <span
                className={`flex items-center text-xs font-bold ${
                  artwork.status === "Available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1.5 animate-pulse ${
                    artwork.status === "Available"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {artwork.status}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setPreviewOpen(false)}
            className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all"
          >
            Close
          </button>

          <div className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-black flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt={artwork.title}
                  className="w-full h-full max-h-[80vh] object-contain"
                />
              </div>

              <div className="p-6 lg:p-8">
                <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4">
                  Quick Preview
                </span>

                <h2 className="text-3xl font-black text-[#0b1120] dark:text-white mb-3">
                  {artwork.title}
                </h2>

                {artwork.artist && (
                  <p className="text-gray-500 dark:text-gray-300 mb-2">
                    <span className="font-bold">Artist:</span> {artwork.artist}
                  </p>
                )}

                {artwork.category && (
                  <p className="text-gray-500 dark:text-gray-300 mb-2">
                    <span className="font-bold">Category:</span> {artwork.category}
                  </p>
                )}

                {artwork.status && (
                  <p className="text-gray-500 dark:text-gray-300 mb-2">
                    <span className="font-bold">Status:</span> {artwork.status}
                  </p>
                )}

                {artwork.price && (
                  <p className="text-blue-700 dark:text-blue-400 font-extrabold text-lg mb-4">
                    ${Number(artwork.price).toLocaleString()}
                  </p>
                )}

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <h3 className="font-black text-[#0b1120] dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {artwork.description || "No description available."}
                  </p>
                </div>

                <Link
                  to={`/gallery/${artwork.id}`}
                  onClick={() => setPreviewOpen(false)}
                  className="inline-block mt-6 px-5 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all"
                >
                  Open Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

