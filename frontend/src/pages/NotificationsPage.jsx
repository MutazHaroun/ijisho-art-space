import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    localStorage.getItem("userID");

  const loadNotifications = async () => {
    try {
      setLoading(true);

      if (!userId) {
        setNotifications([]);
        return;
      }

      const res = await api.get(`/notifications?user_id=${userId}`);
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Load notifications error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      setActionLoading(`read-${id}`);

      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Mark as read error:", error);
      toast.error(
        error.response?.data?.message || "Failed to mark notification"
      );
    } finally {
      setActionLoading("");
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!userId) {
        toast.error("Please login first");
        return;
      }

      setActionLoading("mark-all");

      await api.put("/notifications/mark-all/read", {
        user_id: userId,
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Mark all as read error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update notifications"
      );
    } finally {
      setActionLoading("");
    }
  };

  const deleteNotification = async (id) => {
    try {
      setActionLoading(`delete-${id}`);

      await api.delete(`/notifications/${id}`);

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Delete notification error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete notification"
      );
    } finally {
      setActionLoading("");
    }
  };

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/admin/login");
      return;
    }

    loadNotifications();
  }, [navigate, userId]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";
    return new Date(dateValue).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-lg font-bold text-[#0b1120]">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-bold mb-4">
          Notifications
        </span>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#0b1120] mb-3">
              Your Notifications
            </h1>

            <p className="text-gray-500">
              See updates about your orders and payments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-orange-50 text-orange-600 font-bold text-sm">
              Unread: {unreadCount}
            </span>

            <button
              onClick={loadNotifications}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all"
            >
              Refresh
            </button>

            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={actionLoading === "mark-all"}
                className="px-4 py-2 rounded-xl bg-[#0b1120] text-white text-sm font-bold hover:bg-orange-600 transition-all disabled:opacity-60"
              >
                {actionLoading === "mark-all" ? "Updating..." : "Mark All Read"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl border p-5 shadow-sm transition-all ${
                notification.is_read
                  ? "bg-white border-gray-100"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-black text-[#0b1120]">
                      {notification.title}
                    </h3>

                    {!notification.is_read && (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black">
                        New
                      </span>
                    )}

                    {notification.type && (
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black capitalize">
                        {notification.type}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {formatDate(notification.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      disabled={actionLoading === `read-${notification.id}`}
                      className="px-4 py-2 rounded-xl bg-[#0b1120] text-white text-sm font-bold hover:bg-orange-600 transition-all disabled:opacity-60"
                    >
                      {actionLoading === `read-${notification.id}`
                        ? "Updating..."
                        : "Mark Read"}
                    </button>
                  )}

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    disabled={actionLoading === `delete-${notification.id}`}
                    className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-all disabled:opacity-60"
                  >
                    {actionLoading === `delete-${notification.id}`
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-gray-500 font-medium">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

