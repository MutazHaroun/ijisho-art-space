import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/admin/login", form);
      
      // حفظ التوكن والمعلومات في المتصفح
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role); 
      localStorage.setItem("userName", data.username);

      // --- منطق التوجيه الذكي (التعديل هنا) ---
      if (data.role === "admin") {
        // المسؤول فقط يذهب للوحة التحكم
        navigate("/admin/dashboard");
      } else {
        // المستخدم العادي يذهب للصفحة الرئيسية للمعرض
        navigate("/"); 
      }

    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="bg-white shadow-2xl rounded-[2.5rem] p-10 w-full max-w-md border border-gray-100">
        
        <h1 className="text-3xl font-black text-gray-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-10 font-medium text-sm">
          Sign in to your Ijisho account
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-2xl text-sm font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter your username"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b1120] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            New to the gallery? 
            <Link to="/register" className="text-orange-600 font-black hover:underline ml-1">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
