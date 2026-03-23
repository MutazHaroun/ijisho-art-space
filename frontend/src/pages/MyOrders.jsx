import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    localStorage.getItem("userID");

  useEffect(() => {
    const loadMyOrders = async () => {
      try {
        if (!userId) {
          toast.error("Please login first");
          navigate("/admin/login");
          return;
        }

        setLoading(true);
        const res = await api.get(`/orders/my-orders/${userId}`);
        setOrders(res.data || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load your orders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyOrders();
  }, [navigate, userId]);

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );
  }, [orders]);

  const goToTrackOrder = (trackingCode) => {
    navigate(`/track-order?code=${trackingCode}`, {
      state: { tracking_code: trackingCode },
    });
  };

  const getOrderStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "ready":
        return "bg-blue-100 text-blue-700";
      case "preparing":
        return "bg-orange-100 text-orange-700";
      case "payment_verified":
        return "bg-emerald-100 text-emerald-700";
      case "payment_submitted":
        return "bg-yellow-100 text-yellow-700";
      case "awaiting_payment":
        return "bg-pink-100 text-pink-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-700";
      case "submitted":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-black text-[#0b1120] mb-6">My Orders</h1>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
            My Orders
          </span>

          <h1 className="text-4xl font-black text-[#0b1120] mb-3">
            Your Orders
          </h1>

          <p className="text-gray-500">
            You have not placed any orders yet.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500 text-lg mb-6">No orders found.</p>

          <Link
            to="/gallery"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all"
          >
            Browse Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
            My Orders
          </span>

          <h1 className="text-4xl font-black text-[#0b1120] mb-3">
            Your Orders
          </h1>

          <p className="text-gray-500">
            Track your orders, payment progress, and delivery status.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 min-w-[220px]">
          <p className="text-sm text-gray-500 mb-2">Total Spent</p>
          <h2 className="text-3xl font-black text-green-600">
            RWF {totalSpent.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#0b1120]">
                  Order #{order.id}
                </h2>

                <p className="text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Code</p>
                    <p className="font-bold text-[#0b1120]">
                      {order.tracking_code || "Not generated"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-bold text-[#0b1120]">
                      {order.payment_method || "cash"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-bold ${getPaymentStatusBadge(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status || "pending"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-bold ${getOrderStatusBadge(
                        order.order_status
                      )}`}
                    >
                      {order.order_status || "pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {order.tracking_code && (
                  <button
                    onClick={() => goToTrackOrder(order.tracking_code)}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-all"
                  >
                    Track Order
                  </button>
                )}

                {order.payment_status !== "verified" &&
                  order.payment_method !== "cash" && (
                    <Link
                      to={`/payment/${order.id}`}
                      className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all"
                    >
                      Pay Now
                    </Link>
                  )}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-100 pb-3"
                >
                  <div>
                    <p className="font-bold text-[#0b1120]">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.category} • Qty: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="font-bold text-orange-600">
                    RWF {Number(item.price || 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-right">
              <p className="text-lg font-black text-[#0b1120]">
                Total: RWF {Number(order.total_price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
