import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaUser,
  FaRegCommentDots,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function AdminReviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "admin") {
      navigate("/admin/login");
      return;
    }

    fetchReviews();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/admin/reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate("/admin/login");
        return;
      }

      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString();
  };

  // 🔥 متوسط التقييم
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      reviews.length
    );
  }, [reviews]);

  // 🔍 فلترة
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return reviews.filter(
      (r) =>
        r.comment?.toLowerCase().includes(term) ||
        r.customer_name?.toLowerCase().includes(term) ||
        r.artwork_title?.toLowerCase().includes(term)
    );
  }, [reviews, search]);

  if (loading)
    return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-orange-600 text-white rounded-2xl">
            <FaRegCommentDots />
          </div>

          <div>
            <h1 className="text-3xl font-black">Reviews Management</h1>
            <p className="text-gray-500 text-sm">
              Monitor and moderate feedback
            </p>
          </div>
        </div>

        <Link
          to="/admin/dashboard"
          className="px-4 py-2 border rounded-xl font-bold"
        >
          Dashboard
        </Link>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Reviews</p>
          <h2 className="text-4xl font-black text-pink-600">
            {reviews.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Average Rating</p>
          <h2 className="text-4xl font-black text-yellow-500">
            {avgRating.toFixed(1)}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search reviews..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 border rounded-xl"
      />

      {/* REVIEWS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length ? (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl shadow flex flex-col justify-between"
            >
              <div>
                {/* USER */}
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2 items-center">
                    <FaUser />
                    <span className="font-bold">
                      {rev.customer_name || "Anonymous"}
                    </span>
                  </div>

                  {/* ⭐ النجوم */}
                  <div className="flex text-orange-500">
                    {[1, 2, 3, 4, 5].map((i) =>
                      i <= rev.rating ? (
                        <FaStar key={i} />
                      ) : (
                        <FaRegStar key={i} />
                      )
                    )}
                  </div>
                </div>

                {/* TITLE */}
                {rev.artwork_title && (
                  <p className="text-blue-600 text-xs font-bold mb-2">
                    {rev.artwork_title}
                  </p>
                )}

                {/* COMMENT */}
                <p className="text-sm italic text-gray-600">
                  "{rev.comment}"
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  {formatDate(rev.created_at)}
                </span>

                <button
                  onClick={() => handleDelete(rev.id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews found</p>
        )}
      </div>
    </div>
  );
}

