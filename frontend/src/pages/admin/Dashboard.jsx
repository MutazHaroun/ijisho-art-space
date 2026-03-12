import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

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
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome, {localStorage.getItem("adminUser") || "Admin"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/artworks/new"
            className="bg-primary-600 text-white px-5 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors text-sm"
          >
            + Add Artwork
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Total Artworks</p>
          <p className="text-2xl font-bold text-gray-900">{artworks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Art</p>
          <p className="text-2xl font-bold text-primary-600">
            {artworks.filter((a) => a.category === "Art").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Heritage</p>
          <p className="text-2xl font-bold text-accent-600">
            {artworks.filter((a) => a.category === "Heritage").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-500">Messages</p>
          <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Artworks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {artworks.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">
                    {a.title}
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {a.category}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        a.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {a.price ? `$${Number(a.price).toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <Link
                      to={`/admin/artworks/${a.id}/edit`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {artworks.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-400"
                  >
                    No artworks yet. Click "+ Add Artwork" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Contact Messages
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <p className="px-5 py-8 text-center text-gray-400">
              No messages yet.
            </p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="px-5 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-sm text-gray-500">{m.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
                {m.subject && (
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    {m.subject}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">{m.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
