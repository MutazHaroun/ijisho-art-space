import React from "react";
import ArtworkCard from "./ArtworkCard";

export default function GalleryGrid({ artworks, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No artworks found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
