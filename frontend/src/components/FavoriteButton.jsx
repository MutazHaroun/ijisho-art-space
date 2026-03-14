import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FavoriteButton({ artworkId }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // قراءة المفضلة من localStorage
  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  };

  // تحديث حالة المفضلة
  const checkFavorite = () => {
    const favorites = getFavorites();
    setIsFavorite(favorites.includes(artworkId));
  };

  useEffect(() => {
    checkFavorite();

    // تحديث الحالة إذا تغير localStorage من صفحة أخرى
    const handleStorageChange = () => checkFavorite();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [artworkId]);

  const toggleFavorite = () => {
    const favorites = getFavorites();
    let updatedFavorites;

    if (favorites.includes(artworkId)) {
      updatedFavorites = favorites.filter((id) => id !== artworkId);
      toast.info("Removed from favorites");
    } else {
      updatedFavorites = [...favorites, artworkId];
      toast.success("Added to favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(updatedFavorites.includes(artworkId));
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
        isFavorite
          ? "bg-red-500 text-white scale-105"
          : "bg-white text-gray-500 hover:bg-red-50 hover:text-red-500"
      }`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "❤" : "♡"}
    </button>
  );
}
