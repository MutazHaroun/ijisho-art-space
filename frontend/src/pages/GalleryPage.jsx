import React, { useEffect, useState } from "react";
import api from "../api/axios";
import GalleryGrid from "../components/GalleryGrid";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (activeStatus !== "All") params.set("status", activeStatus);

    setLoading(true);
    api
      .get(`/gallery?${params.toString()}`)
      .then((res) => setArtworks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, activeStatus]);

  const categories = ["All", "Art", "Heritage"];
  const statuses = ["All", "Available", "Sold"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
        <p className="mt-2 text-gray-600">
          Browse our collection of Rwandan art and heritage items
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                activeStatus === s
                  ? "bg-accent-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <GalleryGrid artworks={artworks} loading={loading} />
    </div>
  );
}
