import React, { useEffect, useState } from "react";
import api from "../api/axios";
import GalleryGrid from "../components/GalleryGrid";

export default function FavoritesPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
      setArtworks([]);
      setLoading(false);
      return;
    }

    api
      .get("/gallery", {
        params: {
          limit: 100,
          page: 1,
        },
      })
      .then((res) => {
        const allArtworks = res.data.artworks || [];
        const favoriteArtworks = allArtworks.filter((artwork) =>
          favorites.includes(artwork.id)
        );
        setArtworks(favoriteArtworks);
      })
      .catch((err) => {
        console.error("Failed to fetch favorite artworks:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="mt-2 text-gray-600">
          Your saved favorite artworks collection
        </p>
      </div>

      {!loading && artworks.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No favorites yet
          </h2>
          <p className="text-gray-500">
            Start adding artworks to your favorites and they will appear here.
          </p>
        </div>
      ) : (
        <GalleryGrid artworks={artworks} loading={loading} />
      )}
    </div>
  );
}
