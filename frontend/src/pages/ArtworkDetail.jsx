import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaWhatsapp, FaStar, FaRegStar } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);

  // حالات نظام التقييم
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const artworkRes = await api.get(`/gallery/${id}`);
      setArtwork(artworkRes.data);

      // لو عندك API للمراجعات يمكنك تفعيله لاحقًا
      // const reviewsRes = await api.get(`/gallery/${id}/reviews`);
      // setReviews(reviewsRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load artwork");
    } finally {
      setLoading(false);
    }

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(id));

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setInCart(cart.includes(id));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post(`/gallery/${id}/reviews`, {
        rating: userRating,
        comment: comment,
        customer_name: "Guest User",
      });

      toast.success("Review submitted successfully!");
      setComment("");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleOrderNow = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart.includes(id)) {
      const updatedCart = [...cart, id];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setInCart(true);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart");
    }

    navigate("/checkout");
  };

  const shareArtwork = async () => {
    const shareData = {
      title: artwork?.title,
      text: "Check out this artwork",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      } catch {
        toast.info("Unable to share this item");
      }
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const whatsappUrl = `https://wa.me/250789781166?text=${encodeURIComponent(
    `Hello, I'm interested in: ${artwork?.title}`
  )}`;

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
        <h2 className="text-3xl font-black mb-3 text-[#0b1120] dark:text-white">
          Artwork not found
        </h2>
      </div>
    );
  }

  const imageUrl = getFullImageUrl(artwork.image_url);
  const avgRating = Number(artwork.average_rating || 0);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
            <button onClick={() => setFullscreen(true)} className="w-full group">
              <img
                src={imageUrl}
                alt={artwork.title}
                className="w-full h-[500px] object-cover rounded-2xl"
              />
            </button>

            <button
              onClick={() => setFullscreen(true)}
              className="mt-4 w-full px-4 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all"
            >
              View Fullscreen
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold">
                Artwork Details
              </span>

              <div className="flex items-center text-orange-400">
                <FaStar className="mr-1" />
                <span className="font-bold text-gray-900 dark:text-white">
                  {avgRating.toFixed(1)}
                </span>
              </div>
            </div>

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
                <p className="text-2xl text-blue-600 font-black">
                  RWF {Number(artwork.price).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={toggleFavorite}
                className={`px-5 py-3 rounded-2xl font-bold ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                }`}
              >
                {isFavorite ? "❤ Favorited" : "♡ Add to Favorites"}
              </button>

              <button
                onClick={toggleCart}
                className={`px-5 py-3 rounded-2xl font-bold ${
                  inCart
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 dark:text-white"
                }`}
              >
                {inCart ? "🛒 In Cart" : "🛒 Add to Cart"}
              </button>

              <button
                onClick={shareArtwork}
                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold"
              >
                Share
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-500 text-white font-bold"
              >
                <FaWhatsapp /> WhatsApp
              </a>

              <button
                onClick={handleOrderNow}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-700 transition-all"
              >
                🛒 Order Now
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h2 className="text-xl font-black text-[#0b1120] dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {artwork.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-100 dark:border-gray-800 pt-12">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-black text-[#0b1120] dark:text-white mb-6">
              Leave a Review
            </h3>

            <form
              onSubmit={handleReviewSubmit}
              className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800"
            >
              <div className="mb-4">
                <p className="text-sm font-bold mb-2 dark:text-gray-300">
                  Your Rating
                </p>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setUserRating(s)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      {s <= userRating ? (
                        <FaStar className="text-orange-500" />
                      ) : (
                        <FaRegStar className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <textarea
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Share your thoughts about this art..."
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0b1120] dark:bg-orange-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Post Review"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-[#0b1120] dark:text-white mb-6">
              Reviews ({reviews.length})
            </h3>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((rev, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-orange-500 text-xs">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>

                      <span className="font-black text-sm dark:text-white">
                        {rev.customer_name || "Guest"}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 px-4 py-2 bg-white rounded-xl font-bold"
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

