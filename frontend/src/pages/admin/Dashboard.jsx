import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artworkSearch, setArtworkSearch] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "admin") {
      navigate("/admin/login");
      return;
    }

    Promise.all([api.get("/admin/artworks"), api.get("/admin/messages")])
      .then(([artRes, msgRes]) => {
        setArtworks(artRes.data || []);
        setMessages(msgRes.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          navigate("/admin/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    const savedVisitors = Number(localStorage.getItem("siteVisitors")) || 0;
    setVisitorCount(savedVisitors);
  }, []);

  const handleDeleteArtwork = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this artwork?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/artworks/${id}`);
      setArtworks((prev) => prev.filter((item) => item.id !== id));
      toast.success("Artwork deleted successfully");
    } catch (err) {
      console.error("Delete artwork error:", err);
      toast.error(err.response?.data?.error || "Failed to delete artwork");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";
    return new Date(dateValue).toLocaleDateString();
  };

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/100x100?text=No+Image";

    if (typeof path === "string" && path.startsWith("http")) {
      return path;
    }

    const finalPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${finalPath}`;
  };

  const stats = useMemo(() => {
    const totalArtworks = artworks.length;
    const availableArtworks = artworks.filter(
      (item) => item.status === "Available"
    ).length;
    const soldArtworks = artworks.filter(
      (item) => item.status === "Sold"
    ).length;
    const heritageItems = artworks.filter(
      (item) => item.category === "Heritage"
    ).length;

    const totalMessages = messages.length;

    const totalValue = artworks.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      return sum + price;
    }, 0);

    return {
      totalArtworks,
      availableArtworks,
      soldArtworks,
      heritageItems,
      totalMessages,
      totalValue,
    };
  }, [artworks, messages]);

  const filteredArtworks = useMemo(() => {
    const term = artworkSearch.trim().toLowerCase();

    if (!term) return artworks;

    return artworks.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      const status = (item.status || "").toLowerCase();
      const artist = (item.artist || "").toLowerCase();

      return (
        title.includes(term) ||
        category.includes(term) ||
        status.includes(term) ||
        artist.includes(term)
      );
    });
  }, [artworks, artworkSearch]);

  const recentArtworks = useMemo(() => {
    return [...filteredArtworks]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [filteredArtworks]);

  const recentMessages = useMemo(() => {
    return [...messages]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [messages]);

  const categoryData = useMemo(() => {
    const counts = artworks.reduce((acc, item) => {
      const key = item.category || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [artworks]);

  const statusData = useMemo(() => {
    const counts = artworks.reduce((acc, item) => {
      const key = item.status || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [artworks]);

  const pieColors = ["#16a34a", "#ef4444", "#f59e0b", "#3b82f6"];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
            >
              <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 w-20 bg-gray-300 rounded mb-3"></div>
              <div className="h-3 w-32 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
            Admin Dashboard
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-[#0b1120] tracking-tight">
            Gallery Overview
          </h1>

          <p className="mt-3 text-gray-500 max-w-2xl">
            Monitor artworks, messages, availability, collection value, and visitors from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/artworks/new"
            className="px-5 py-3 rounded-2xl bg-[#0b1120] text-white font-bold shadow-lg hover:bg-orange-600 transition-all"
          >
            + Add Artwork
          </Link>

          <Link
            to="/gallery"
            className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold hover:border-orange-500 hover:text-orange-600 transition-all"
          >
            View Gallery
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Total Artworks</p>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-[#0b1120] text-xs font-black">
              {stats.totalArtworks}
            </span>
          </div>
          <h2 className="text-4xl font-black text-[#0b1120]">
            {stats.totalArtworks}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            All artworks currently stored
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Available</p>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-black">
              {stats.availableArtworks}
            </span>
          </div>
          <h2 className="text-4xl font-black text-green-600">
            {stats.availableArtworks}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Pieces available for visitors
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Sold</p>
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black">
              {stats.soldArtworks}
            </span>
          </div>
          <h2 className="text-4xl font-black text-red-500">
            {stats.soldArtworks}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Pieces already marked as sold
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Heritage Items</p>
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-black">
              {stats.heritageItems}
            </span>
          </div>
          <h2 className="text-4xl font-black text-orange-600">
            {stats.heritageItems}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Cultural and heritage collection
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Messages</p>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black">
              {stats.totalMessages}
            </span>
          </div>

          <h2 className="text-4xl font-black text-blue-600">
            {stats.totalMessages}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Contact messages received
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-500">Total Visitors</p>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-black">
              {visitorCount}
            </span>
          </div>

          <h2 className="text-4xl font-black text-purple-600">
            {visitorCount}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Visitors counted from browser storage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xl font-black text-[#0b1120] mb-4">
            Collection Summary
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Available</span>
                <span>{stats.availableArtworks}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalArtworks
                        ? (stats.availableArtworks / stats.totalArtworks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Sold</span>
                <span>{stats.soldArtworks}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalArtworks
                        ? (stats.soldArtworks / stats.totalArtworks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Heritage</span>
                <span>{stats.heritageItems}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{
                    width: `${
                      stats.totalArtworks
                        ? (stats.heritageItems / stats.totalArtworks) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xl font-black text-[#0b1120] mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/artworks/new"
              className="rounded-2xl border border-gray-200 p-5 hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <h4 className="font-black text-[#0b1120] mb-2">Add New Artwork</h4>
              <p className="text-sm text-gray-500">
                Upload a new artwork to the collection
              </p>
            </Link>

            <Link
              to="/gallery"
              className="rounded-2xl border border-gray-200 p-5 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <h4 className="font-black text-[#0b1120] mb-2">Open Gallery</h4>
              <p className="text-sm text-gray-500">
                View the public gallery experience
              </p>
            </Link>

            <Link
              to="/admin/messages"
              className="rounded-2xl border border-gray-200 p-5 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-[#0b1120]">Manage Messages</h4>
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black">
                  {stats.totalMessages}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                View and delete visitor contact messages
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Artwork Search */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Search Artworks
        </label>
        <input
          type="text"
          value={artworkSearch}
          onChange={(e) => setArtworkSearch(e.target.value)}
          placeholder="Search by title, artist, category, or status..."
          className="w-full px-5 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xl font-black text-[#0b1120] mb-4">
            Artworks by Category
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xl font-black text-[#0b1120] mb-4">
            Artworks by Status
          </h3>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-black text-[#0b1120]">
              Recent Artworks
            </h3>
            <span className="text-sm font-bold text-gray-400">
              {recentArtworks.length} items
            </span>
          </div>

          {recentArtworks.length === 0 ? (
            <p className="text-gray-500">No artworks found.</p>
          ) : (
            <div className="space-y-4">
              {recentArtworks.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={getFullImageUrl(item.image_url)}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/100x100?text=No+Image";
                      }}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />

                    <div className="min-w-0">
                      <h4 className="font-black text-[#0b1120] truncate">
                        {item.title}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {item.category} • {item.status}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Added: {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <p className="font-bold text-blue-600">
                        ${Number(item.price || 0).toLocaleString()}
                      </p>
                      <Link
                        to={`/admin/artworks/${item.id}/edit`}
                        className="text-sm text-orange-600 font-bold hover:underline"
                      >
                        Edit
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDeleteArtwork(item.id)}
                      className="px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-black text-[#0b1120]">
              Recent Messages
            </h3>
            <Link
              to="/admin/messages"
              className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2"
            >
              <span>View All</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black">
                {stats.totalMessages}
              </span>
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-2xl bg-gray-50">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h4 className="font-black text-[#0b1120] truncate">
                        {msg.name || "Visitor"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(msg.created_at)}
                      </p>
                    </div>

                    {msg.email && (
                      <span className="text-xs font-bold text-gray-400 truncate">
                        {msg.email}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {msg.message || "No message content"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

