import React from "react";
import ArtworkCard from "./ArtworkCard";

export default function GalleryGrid({ artworks, loading, isAdmin, onDelete }) {
  // Loading State with Skeleton Cards
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse"
          >
            <div className="aspect-[4/3] bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
                <div className="h-4 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!artworks || artworks.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className="text-2xl font-black text-[#0b1120] mb-2">
          No artworks found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn’t find any artworks matching your current search or filters.
        </p>
      </div>
    );
  }

  // Artworks Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

