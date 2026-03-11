import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function ArtworkForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for new, present for edit
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Art",
    status: "Available",
    price: "",
    artist: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (isEdit) {
      api
        .get(`/gallery/${id}`)
        .then((res) => {
          const a = res.data;
          setForm({
            title: a.title || "",
            description: a.description || "",
            category: a.category || "Art",
            status: a.status || "Available",
            price: a.price || "",
            artist: a.artist || "",
          });
          if (a.image_url) {
            const apiUrl =
              process.env.REACT_APP_API_URL || "http://localhost:5001";
            setPreview(`${apiUrl}${a.image_url}`);
          }
        })
        .catch(() => setError("Failed to load artwork"));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("status", form.status);
    formData.append("price", form.price);
    formData.append("artist", form.artist);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (isEdit) {
        await api.put(`/admin/artworks/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/artworks", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to save artwork. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Artwork" : "Add New Artwork"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artist
          </label>
          <input
            type="text"
            name="artist"
            value={form.artist}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="Art">Art</option>
              <option value="Heritage">Heritage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-40 rounded-md object-cover"
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Artwork" : "Create Artwork"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
