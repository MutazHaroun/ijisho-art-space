import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Helper function to handle image paths.
   * Resolves issues where paths might still point to port 5001
   * or are missing the /uploads prefix.
   */
  const getImageUrl = (path) => {
    if (!path) return null;
    
    // Fix for legacy data pointing to the wrong port
    if (typeof path === 'string' && path.includes(":5001")) {
      const fileName = path.split("/uploads/")[1];
      return `${API_URL}/uploads/${fileName}`;
    }

    // Handle external links
    if (path.startsWith("http") && !path.includes("localhost")) return path;

    // Handle local paths
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${cleanPath}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Fetch Artworks and Messages simultaneously
    Promise.all([api.get("/admin/artworks"), api.get("/admin/messages")])
      .then(([artRes, msgRes]) => {
        setArtworks(artRes.data);
        setMessages(msgRes.data);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this artwork?")) return;
    try {
      await api.delete(`/admin/artworks/${id}`);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete artwork");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, <span className="font-semibold text-blue-600">{localStorage.getItem("adminUser") || "Admin"}</span>
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link
            to="/admin/artworks/new"
            className="flex-1 text-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md text-sm"
          >
            + Add New Artwork
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-all text-sm border border-red-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Artworks", value: artworks.length, color: "border-gray-400 text-gray-900" },
          { label: "Art Category", value: artworks.filter(a => a.category === "Art").length, color: "border-blue-500 text-blue-600" },
          { label: "Heritage Category", value: artworks.filter(a => a.category === "Heritage").length, color: "border-orange-500 text-orange-600" },
          { label: "Messages", value: messages.length, color: "border-purple-500 text-purple-600" }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${stat.color} hover:shadow-md transition-shadow`}>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* --- Gallery Inventory Table --- */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-gray-100">
        <div className="px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Gallery Inventory</h2>
          <Link to="/gallery" className="text-sm text-blue-600 hover:underline">Preview Gallery →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {artworks.map((a) => (
                <tr key={a.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={getImageUrl(a.image_url)}
                      alt={a.title}
                      className="h-14 w-14 rounded-xl object-cover border border-gray-200 bg-gray-100"
                      onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Error"; }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{a.title}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${a.category === 'Art' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {a.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {a.price ? `$${Number(a.price).toLocaleString()}` : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link to={`/admin/artworks/${a.id}/edit`} className="text-sm font-bold text-blue-600 hover:text-blue-800">Edit</Link>
                    <button onClick={() => handleDelete(a.id)} className="text-sm font-bold text-red-600 hover:text-red-800 ml-4">Delete</button>
                  </td>
                </tr>
              ))}
              {artworks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No artworks found. Click "+ Add New Artwork" to start.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Contact Messages Section --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Recent Inquiries</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {messages.length === 0 ? (
            <p className="px-6 py-10 text-center text-gray-400 italic">No messages found.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{m.name}</p>
                    <p className="text-xs text-blue-500 font-medium">{m.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {/* تحسين لضمان ظهور التاريخ بالإنجليزية */}
                    {new Date(m.created_at).toLocaleDateString('en-US')}
                  </span>
                </div>
                {m.subject && <p className="text-sm font-bold text-gray-700 mb-1">{m.subject}</p>}
                <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">"{m.message}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

