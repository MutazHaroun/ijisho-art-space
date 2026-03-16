import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkDetail() {
  const { id } = useParams();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/gallery/${id}`)
      .then((res) => setArtwork(res.data))
      .catch((err) => console.error("Failed to fetch artwork:", err))
      .finally(() => setLoading(false));

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(id));

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setInCart(cart.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    let updated;

    if (favorites.includes(id)) {
      updated = favorites.filter((item) => item !== id);
      toast.info("Removed from favorites");
      setIsFavorite(false);
    } else {
      updated = [...favorites, id];
      toast.success("Added to favorites");
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const toggleCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let updated;

    if (cart.includes(id)) {
      updated = cart.filter((item) => item !== id);
      toast.info("Removed from cart");
      setInCart(false);
    } else {
      updated = [...cart, id];
      toast.success("Added to cart");
      setInCart(true);
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const shareArtwork = async () => {
    const shareData = {
      title: artwork.title,
      text: "Check out this artwork",
      url: window.location.href,
    };

    try {
      await navigator.share(shareData);
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in this artwork: ${artwork?.title || "Artwork"}`
  );

  const whatsappUrl = `https://wa.me/250789781166?text=${whatsappMessage}`;
  const instagramUrl = "https://www.instagram.com/ijisho_artspace/";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-pulse">
          <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6"></div>
          <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-[#0b1120] dark:text-white mb-3">
          Artwork not found
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          The artwork you are looking for does not exist.
        </p>
      </div>
    );
  }

  const imageUrl = getFullImageUrl(artwork.image_url);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Image */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
            <button onClick={() => setFullscreen(true)} className="w-full group">
              <img
                src={imageUrl}
                alt={artwork.title}
                className="w-full h-[500px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>

            <button
              onClick={() => setFullscreen(true)}
              className="mt-4 w-full px-4 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all"
            >
              View Fullscreen
            </button>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4">
              Artwork Details
            </span>

            <h1 className="text-4xl font-black text-[#0b1120] dark:text-white mb-4">
              {artwork.title}
            </h1>

            <div className="space-y-3 text-gray-600 dark:text-gray-300 mb-6">
              {artwork.artist && (
                <p>
                  <b>Artist:</b> {artwork.artist}
                </p>
              )}

              {artwork.category && (
                <p>
                  <b>Category:</b> {artwork.category}
                </p>
              )}

              {artwork.status && (
                <p>
                  <b>Status:</b> {artwork.status}
                </p>
              )}

              {artwork.price && (
                <p>
                  <b>Price:</b> ${Number(artwork.price).toLocaleString()}
                </p>
              )}

              {artwork.created_at && (
                <p>
                  <b>Added:</b>{" "}
                  {new Date(artwork.created_at).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Main Buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={toggleFavorite}
                className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                }`}
              >
                {isFavorite ? "❤ Favorited" : "♡ Add to Favorites"}
              </button>

              <button
                onClick={toggleCart}
                className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                  inCart
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                }`}
              >
                {inCart ? "🛒 In Cart" : "🛒 Add to Cart"}
              </button>

              <button
                onClick={shareArtwork}
                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
              >
                Share
              </button>
            </div>

            {/* Social Contact Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition-all"
              >
                <FaInstagram className="text-xl" />
                Instagram
              </a>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h2 className="text-xl font-black text-[#0b1120] dark:text-white mb-3">
                Description
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {artwork.description || "No description available for this artwork."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all"
          >
            Close
          </button>

          <img
            src={imageUrl}
            alt={artwork.title}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
