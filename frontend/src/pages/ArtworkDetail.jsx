import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

// 1. Core API URL Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkDetail() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual WhatsApp number (International format: e.g., 2507XXXXXXXX)
  const MY_PHONE_NUMBER = "2507XXXXXXXX"; 

  useEffect(() => {
    api
      .get(`/gallery/${id}`)
      .then((res) => setArtwork(res.data))
      .catch(() => setError("Artwork not found"))
      .finally(() => setLoading(false));
  }, [id]);

  /**
   * Smart Image URL Resolver:
   * Handles local uploads, external links, and the 5001/5000 port fix.
   */
  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    
    if (typeof path === 'string' && path.includes(":5001")) {
      const fileName = path.split("/uploads/")[1];
      return `${API_URL}/uploads/${fileName}`;
    }

    if (path.startsWith("http") && !path.includes("localhost")) return path;
    
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  /**
   * WhatsApp Integration:
   * Opens a chat with a pre-filled English message including the item title.
   */
  const handleWhatsAppInquiry = () => {
    const message = `Hello Ijisho Art Space, I'm interested in the artwork: "${artwork.title}". \nLink: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${MY_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <Link to="/gallery" className="text-blue-600 hover:underline">
          &larr; Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/gallery"
        className="text-blue-600 hover:underline text-sm mb-8 inline-block font-medium"
      >
        &larr; Back to Gallery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* --- Image Section --- */}
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2 border border-gray-100">
          <img
            src={getFullImageUrl(artwork.image_url)}
            alt={artwork.title}
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>

        {/* --- Details Section --- */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-gray-900 leading-tight">{artwork.title}</h1>
          
          {artwork.artist && (
            <p className="mt-3 text-xl text-gray-500 italic">by {artwork.artist}</p>
          )}

          <div className="flex items-center gap-4 mt-6">
            <span className={`text-xs font-bold px-4 py-1.5 rounded-full shadow-sm ${
              artwork.category === "Art" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
            }`}>
              {artwork.category}
            </span>
            <span className={`text-xs font-bold px-4 py-1.5 rounded-full shadow-sm ${
              artwork.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}>
              {artwork.status}
            </span>
          </div>

          {artwork.price && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Price</p>
              <p className="text-3xl font-black text-blue-700">
                ${Number(artwork.price).toLocaleString()}
              </p>
            </div>
          )}

          {artwork.description && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 border-gray-100">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {artwork.description}
              </p>
            </div>
          )}

          {/* --- Actions --- */}
          <div className="mt-10 flex flex-col gap-4">
            <button
              onClick={handleWhatsAppInquiry}
              className="w-full bg-green-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-3 text-lg"
            >
              <span>Inquire via WhatsApp</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
            <Link
              to="/gallery"
              className="text-center text-gray-500 font-medium hover:text-gray-800 transition-colors"
            >
              Explore more from the gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

