import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "admin") {
      navigate("/admin/login");
      return;
    }

    api
      .get("/admin/profile")
      .then((res) => {
        const data = res.data || {};
        setName(data.names || "");
        setEmail(data.email || "");
        setRole(data.role || "admin");
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("userName");
          navigate("/admin/login");
          return;
        }

        toast.error(err.response?.data?.error || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const { data } = await api.put("/admin/profile", payload);

      const updatedUser = data.user || {};

      setName(updatedUser.names || name);
      setEmail(updatedUser.email || email);
      setRole(updatedUser.role || role);
      setPassword("");

      localStorage.setItem("userName", updatedUser.names || name);

      toast.success(data.message || "Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-5">
            <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-bold mb-4">
          Admin Profile
        </span>

        <h1 className="text-4xl font-black text-[#0b1120] dark:text-white">
          Account Settings
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-2">
          Manage your admin account information.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
              Admin Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0b1120] dark:text-white focus:bg-white dark:focus:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Admin name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[#0b1120] dark:text-white focus:bg-white dark:focus:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Leave empty to keep current password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#0b1120] text-white py-3 rounded-xl font-black hover:bg-orange-600 transition-all disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="font-black text-xl mb-4 text-[#0b1120] dark:text-white">
          Account Information
        </h2>

        <div className="space-y-3 text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-bold">Role:</span> {role}
          </p>

          <p>
            <span className="font-bold">Access:</span> Full Dashboard Control
          </p>

          <p>
            <span className="font-bold">Permissions:</span> Manage artworks,
            messages and gallery
          </p>
        </div>
      </div>
    </div>
  );
}
