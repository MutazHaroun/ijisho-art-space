import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ArtworkDetail() {
  const { id } = useParams();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/gallery/${id}`)
      .then((res) => setArtwork(res.data))
      .catch((err) => console.error("Failed to fetch artwork:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 animate-pulse">
          <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6"></div>
          <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
          <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-700 rounded"></div>
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
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
            <button
              onClick={() => setFullscreen(true)}
              className="w-full group"
              title="Open full image"
            >
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
                  <span className="font-bold">Artist:</span> {artwork.artist}
                </p>
              )}

              {artwork.category && (
                <p>
                  <span className="font-bold">Category:</span> {artwork.category}
                </p>
              )}

              {artwork.status && (
                <p>
                  <span className="font-bold">Status:</span> {artwork.status}
                </p>
              )}

              {artwork.price && (
                <p>
                  <span className="font-bold">Price:</span> $
                  {Number(artwork.price).toLocaleString()}
                </p>
              )}

              {artwork.created_at && (
                <p>
                  <span className="font-bold">Added:</span>{" "}
                  {new Date(artwork.created_at).toLocaleDateString()}
                </p>
              )}
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

