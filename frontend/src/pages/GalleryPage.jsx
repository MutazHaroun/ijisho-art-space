import React, { useEffect, useState } from "react";
import api from "../api/axios";
import GalleryGrid from "../components/GalleryGrid";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim() !== "") params.set("search", search.trim());
    if (activeCategory !== "All") params.set("category", activeCategory);
    if (activeStatus !== "All") params.set("status", activeStatus);

    params.set("sort", sort);
    params.set("page", currentPage);
    params.set("limit", 6);

    setLoading(true);

    api
      .get(`/gallery?${params.toString()}`)
      .then((res) => {
        setArtworks(res.data.artworks || []);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalItems || 0);
      })
      .catch((err) => {
        console.error("Failed to fetch artworks:", err);
      })
      .finally(() => setLoading(false));
  }, [search, activeCategory, activeStatus, sort, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCategory, activeStatus, sort]);

  const categories = ["All", "Art", "Heritage"];
  const statuses = ["All", "Available", "Sold"];

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setActiveStatus("All");
    setSort("newest");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4">
          Ijisho Art Space Collection
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-[#0b1120] dark:text-white tracking-tight">
          Explore the Gallery
        </h1>

        <p className="mt-4 text-gray-500 dark:text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
          Discover Rwandan artworks and heritage pieces curated with culture,
          story, and creativity.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="px-5 py-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm text-sm font-black text-[#0b1120] dark:text-white">
            {loading ? "Loading artworks..." : `${totalItems} Artworks Available`}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm rounded-3xl p-6 md:p-8 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by artwork title..."
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0b1120] dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0b1120] dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0b1120] dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0b1120] dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-300 font-medium">
            {loading ? "Loading results..." : `${totalItems} artwork(s) found`}
          </div>

          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#0b1120] text-white text-sm font-bold hover:bg-orange-600 transition-all"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {!loading && artworks.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-[#0b1120] dark:text-white mb-3">
            No artworks found
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            Try changing the search or filters to see more results.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-[#0b1120] transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <GalleryGrid artworks={artworks} loading={loading} />
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>

          <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-white">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-[#0b1120] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
