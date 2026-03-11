import React from "react";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function ArtworkCard({ artwork }) {
  const imageSrc = artwork.image_url
    ? `${API_URL}${artwork.image_url}`
    : "https://placehold.co/400x300?text=No+Image";

  return (
    <Link
      to={`/gallery/${artwork.id}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={imageSrc}
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
          {artwork.title}
        </h3>
        {artwork.artist && (
          <p className="text-sm text-gray-500 mt-1">by {artwork.artist}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              artwork.category === "Art"
                ? "bg-primary-100 text-primary-700"
                : "bg-accent-100 text-accent-700"
            }`}
          >
            {artwork.category}
          </span>
          <span
            className={`text-xs font-medium ${
              artwork.status === "Available"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {artwork.status}
          </span>
        </div>
        {artwork.price && (
          <p className="mt-2 text-primary-700 font-bold">
            ${Number(artwork.price).toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  );
}
