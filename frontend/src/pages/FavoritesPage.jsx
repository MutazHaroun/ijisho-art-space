import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import GalleryGrid from "../components/GalleryGrid";

export default function FavoritesPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  };

  const loadFavorites = async () => {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      setArtworks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/gallery", {
        params: {
          limit: 100,
          page: 1,
          sort: "newest",
        },
      });

      const allArtworks = res.data.artworks || [];
      const favoriteArtworks = allArtworks.filter((artwork) =>
        favorites.includes(artwork.id)
      );

      setArtworks(favoriteArtworks);
    } catch (err) {
      console.error("Failed to fetch favorite artworks:", err);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();

    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-red-50 text-red-600 text-sm font-bold mb-4">
          Saved Collection
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-[#0b1120] dark:text-white tracking-tight">
          My Favorites
        </h1>

        <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your saved favorite artworks collection in one place.
        </p>

        {!loading && (
          <div className="mt-5 flex justify-center">
            <span className="px-4 py-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-black text-[#0b1120] dark:text-white shadow-sm">
              {artworks.length} Favorite Artwork(s)
            </span>
          </div>
        )}
      </div>

      {!loading && artworks.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">♡</div>
          <h2 className="text-2xl font-black text-[#0b1120] dark:text-white mb-3">
            No favorites yet
          </h2>
          <p className="text-gray-500 dark:text-gray-300 max-w-xl mx-auto mb-8">
            Start adding artworks to your favorites and they will appear here.
          </p>

          <Link
            to="/gallery"
            className="inline-block px-6 py-3 rounded-2xl bg-[#0b1120] text-white font-bold shadow-lg hover:bg-orange-600 transition-all"
          >
            Explore Gallery
          </Link>
        </div>
      ) : (
        <GalleryGrid artworks={artworks} loading={loading} />
      )}
    </div>
  );
}
