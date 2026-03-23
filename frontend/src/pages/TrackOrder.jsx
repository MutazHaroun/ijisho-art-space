import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function TrackOrder() {
  const [trackingCode, setTrackingCode] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const statusSteps = [
    "pending",
    "awaiting_payment",
    "payment_submitted",
    "payment_verified",
    "preparing",
    "ready",
    "completed",
  ];

  const getProgress = (status) => {
    const index = statusSteps.indexOf(status);
    if (index === -1) return 5;
    return ((index + 1) / statusSteps.length) * 100;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "preparing":
      case "ready":
        return "text-orange-600";
      case "payment_verified":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "submitted":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.order_status) : -1;

  const fetchOrder = async (code, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/orders/track/${code}`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
      setOrder(null);
      if (!silent) {
        toast.error(error.response?.data?.error || "Tracking code not found");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeFromQuery = params.get("code");
    const codeFromState = location.state?.tracking_code;

    const finalCode = codeFromQuery || codeFromState;

    if (finalCode) {
      setTrackingCode(finalCode);
      fetchOrder(finalCode);
    }
  }, [location]);

  useEffect(() => {
    if (!trackingCode.trim() || !order) return;

    const interval = setInterval(() => {
      fetchOrder(trackingCode, true);
    }, 10000);

    return () => clearInterval(interval);
  }, [trackingCode, order]);

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingCode.trim()) {
      toast.error("Please enter tracking code");
      return;
    }

    fetchOrder(trackingCode.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
          Order Tracking
        </span>

        <h1 className="text-4xl font-black text-[#0b1120] mb-3">
          Track Your Order
        </h1>

        <p className="text-gray-500">
          Enter your tracking code to check your order status.
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10"
      >
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Tracking Code
        </label>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Example: IJI-1711165000-123456"
            className="flex-1 px-5 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all disabled:opacity-60"
          >
            {loading ? "Tracking..." : "Track Order"}
          </button>
        </div>
      </form>

      {order && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Tracking Code</p>
                <p className="font-black text-[#0b1120]">{order.tracking_code}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-black text-[#0b1120]">
                  {order.customer_name || "Guest"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-black text-[#0b1120]">
                  {order.customer_phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-black text-[#0b1120]">
                  {order.payment_method || "cash"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p
                  className={`font-black capitalize ${getPaymentStatusColor(
                    order.payment_status
                  )}`}
                >
                  {(order.payment_status || "pending").replaceAll("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-black text-green-600">
                  RWF {Number(order.total_price || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-2xl font-black text-[#0b1120] mb-6">
              Order Progress
            </h2>

            <div className="mb-6">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-orange-600 rounded-full transition-all duration-700"
                  style={{ width: `${getProgress(order.order_status)}%` }}
                />
              </div>

              <p
                className={`mt-3 font-bold capitalize ${getStatusColor(
                  order.order_status
                )}`}
              >
                {(order.order_status || "pending").replaceAll("_", " ")}
              </p>

              {order.order_status === "completed" && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mt-4">
                  🎉 Your order has been completed successfully!
                </div>
              )}

              {order.order_status === "cancelled" && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mt-4">
                  This order has been cancelled.
                </div>
              )}
            </div>

            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const active = index <= currentStepIndex;

                return (
                  <div key={step} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                        active
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <p
                        className={`font-bold capitalize ${
                          active ? "text-[#0b1120]" : "text-gray-400"
                        }`}
                      >
                        {step.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-2xl font-black text-[#0b1120] mb-6">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items?.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4"
                  >
                    <div>
                      <p className="font-black text-[#0b1120]">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.category} • Qty: {item.quantity || 1}
                      </p>
                    </div>

                    <p className="font-bold text-orange-600">
                      RWF {Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items found for this order.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
