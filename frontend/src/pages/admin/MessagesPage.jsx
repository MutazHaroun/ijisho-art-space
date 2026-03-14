import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function MessagesPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "admin") {
      navigate("/admin/login");
      return;
    }

    api
      .get("/admin/messages")
      .then((res) => {
        setMessages(res.data || []);
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

  const handleDeleteMessage = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success("Message deleted successfully");
    } catch (err) {
      console.error("Delete message error:", err);
      toast.error(err.response?.data?.error || "Failed to delete message");
    }
  };

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return messages;

    return messages.filter((msg) => {
      const name = (msg.name || "").toLowerCase();
      const email = (msg.email || "").toLowerCase();
      const subject = (msg.subject || "").toLowerCase();
      const message = (msg.message || "").toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        subject.includes(term) ||
        message.includes(term)
      );
    });
  }, [messages, search]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";
    return new Date(dateValue).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
            Admin Messages
          </span>

          <h1 className="text-4xl md:text-5xl font-black text-[#0b1120] tracking-tight">
            Contact Messages
          </h1>

          <p className="mt-3 text-gray-500 max-w-2xl">
            Review visitor messages, search through them, and manage your inbox.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Search Messages
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, subject, or message..."
          className="w-full px-5 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
            >
              <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 w-56 bg-gray-100 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
              <div className="h-4 w-4/5 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <h2 className="text-2xl font-black text-[#0b1120] mb-3">
            No messages found
          </h2>
          <p className="text-gray-500">
            There are no messages matching your search.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-black text-[#0b1120]">
                    {msg.name || "Visitor"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 break-all">
                    {msg.email || "No email provided"}
                  </p>

                  {msg.subject && (
                    <p className="text-sm font-bold text-orange-600 mt-2">
                      Subject: {msg.subject}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(msg.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 lg:mt-0 shrink-0">

                  {msg.email && (
  <a
    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
      msg.subject || "Your message to Ijisho Art Space"
    )}`}
    className="flex-1 lg:flex-none text-center px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-all"
  >
    Reply
  </a>
)}

<button
  onClick={() => handleDeleteMessage(msg.id)}
  className="flex-1 lg:flex-none text-center px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
>
  Delete
</button>


                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 leading-relaxed break-words">
                {msg.message || "No message content"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

