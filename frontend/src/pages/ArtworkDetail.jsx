import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function ArtworkDetail() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/gallery/${id}`)
      .then((res) => setArtwork(res.data))
      .catch(() => setError("Artwork not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <Link to="/gallery" className="text-primary-600 hover:underline">
          &larr; Back to Gallery
        </Link>
      </div>
    );
  }

  const imageSrc = artwork.image_url
    ? `${API_URL}${artwork.image_url}`
    : "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/gallery"
        className="text-primary-600 hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to Gallery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={imageSrc}
            alt={artwork.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{artwork.title}</h1>
          {artwork.artist && (
            <p className="mt-2 text-lg text-gray-600">by {artwork.artist}</p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                artwork.category === "Art"
                  ? "bg-primary-100 text-primary-700"
                  : "bg-accent-100 text-accent-700"
              }`}
            >
              {artwork.category}
            </span>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                artwork.status === "Available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {artwork.status}
            </span>
          </div>

          {artwork.price && (
            <p className="mt-6 text-2xl font-bold text-primary-700">
              ${Number(artwork.price).toLocaleString()}
            </p>
          )}

          {artwork.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {artwork.description}
              </p>
            </div>
          )}

          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-block bg-primary-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Inquire About This Piece
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
