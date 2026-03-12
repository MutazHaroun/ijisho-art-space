import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("userRole", "user");
      localStorage.setItem("userName", data.name || form.name);

      navigate("/");
    } catch (err) {
      const serverMessage =
        err.response?.data?.error || err.response?.data?.message;
      setError(serverMessage || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="bg-white shadow-2xl rounded-[2.5rem] p-10 w-full max-w-lg border border-gray-100">
        <h1 className="text-3xl font-black text-[#0b1120] text-center mb-2">
          Join the Gallery
        </h1>

        <p className="text-gray-500 text-center mb-10 font-medium">
          Create your account and explore the gallery
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Mohammed Faiz"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="mfa@example.com"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b1120] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Setting up account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?
            <Link
              to="/admin/login"
              className="text-orange-600 font-black hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

