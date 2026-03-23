import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "admin") {
      navigate("/admin/login");
      return;
    }

    loadOrders();
  }, [navigate]);

  const refreshSelectedOrder = async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setSelectedOrder(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      setActionLoading(`order-${id}`);
      await api.put(`/orders/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                order_status: status,
              }
            : o
        )
      );

      if (selectedOrder?.id === id) {
        await refreshSelectedOrder(id);
      }

      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    } finally {
      setActionLoading("");
    }
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      setActionLoading(`payment-${id}`);
      await api.put(`/orders/${id}/payment-status`, { status });

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;

          return {
            ...o,
            payment_status: status,
            order_status:
              status === "verified"
                ? "payment_verified"
                : status === "rejected"
                ? o.order_status
                : o.order_status,
          };
        })
      );

      if (selectedOrder?.id === id) {
        await refreshSelectedOrder(id);
      }

      toast.success("Payment status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update payment status");
    } finally {
      setActionLoading("");
    }
  };

  const handleQuickVerify = async (order) => {
    await updatePaymentStatus(order.id, "verified");
  };

  const handleQuickPreparing = async (order) => {
    await updateOrderStatus(order.id, "preparing");
  };

  const handleQuickReady = async (order) => {
    await updateOrderStatus(order.id, "ready");
  };

  const handleQuickCompleted = async (order) => {
    await updateOrderStatus(order.id, "completed");
  };

  const deleteOrder = async (id) => {
    const confirmed = window.confirm("Delete this order?");
    if (!confirmed) return;

    try {
      setActionLoading(`delete-${id}`);
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));

      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }

      toast.success("Order deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setActionLoading("");
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setSelectedOrder(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order details");
    }
  };

  const getOrderStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
      case "ready":
        return "bg-green-100 text-green-700";
      case "payment_verified":
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "awaiting_payment":
      case "payment_submitted":
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase().trim();

    let result = [...orders];

    if (term) {
      result = result.filter((o) => {
        return (
          (o.customer_name || "").toLowerCase().includes(term) ||
          (o.customer_phone || "").toLowerCase().includes(term) ||
          (o.tracking_code || "").toLowerCase().includes(term)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => {
        if (statusFilter === "verified_payments") {
          return o.payment_status === "verified";
        }

        return o.order_status === statusFilter;
      });
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders, search, statusFilter]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    [
      "pending",
      "awaiting_payment",
      "payment_submitted",
      "payment_verified",
      "preparing",
    ].includes(o.order_status)
  ).length;
  const completedOrders = orders.filter((o) =>
    ["ready", "completed"].includes(o.order_status)
  ).length;
  const verifiedPayments = orders.filter(
    (o) => o.payment_status === "verified"
  ).length;

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-[#0b1120]">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
            Admin Orders
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0b1120]">
            Manage Orders
          </h1>
          <p className="text-gray-500 mt-2">
            Review orders, verify payments, and control delivery progress.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadOrders}
            className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold hover:border-orange-500 hover:text-orange-600 transition-all"
          >
            Refresh
          </button>

          <div className="text-right bg-white rounded-2xl border border-gray-100 px-5 py-3 shadow-sm">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h2 className="text-2xl font-black text-green-600">
              RWF {totalRevenue.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-2">Total Orders</p>
          <h2 className="text-4xl font-black text-[#0b1120]">{totalOrders}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-2">Pending Orders</p>
          <h2 className="text-4xl font-black text-orange-600">{pendingOrders}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-2">Completed Orders</p>
          <h2 className="text-4xl font-black text-green-600">{completedOrders}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
          <p className="text-sm font-bold text-gray-500 mb-2">Verified Payments</p>
          <h2 className="text-4xl font-black text-blue-600">{verifiedPayments}</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow border border-gray-100 mb-8">
        <div className="grid lg:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by customer name, phone, or tracking code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-4 border rounded-2xl bg-white outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="payment_verified">Payment Verified</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="verified_payments">Verified Payments</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.length ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl shadow border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#0b1120]">
                    Order #{order.id}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Tracking Code:{" "}
                    <span className="font-black text-[#0b1120]">
                      {order.tracking_code || "-"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-black capitalize ${getOrderStatusColor(
                      order.order_status
                    )}`}
                  >
                    {(order.order_status || "pending").replaceAll("_", " ")}
                  </span>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-black capitalize ${getPaymentStatusColor(
                      order.payment_status
                    )}`}
                  >
                    Payment: {(order.payment_status || "pending").replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-black text-[#0b1120]">
                    {order.customer_name || "Guest"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-black text-[#0b1120]">
                    {order.customer_phone || "-"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-black text-[#0b1120] capitalize">
                    {order.payment_method || "cash"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-black text-green-600">
                    RWF {Number(order.total_price || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-black text-[#0b1120] mb-3">
                  Order Items
                </h3>

                <div className="space-y-3">
                  {order.items?.length ? (
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center border-b border-gray-100 pb-3"
                      >
                        <div>
                          <p className="font-bold text-[#0b1120]">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.category || "No category"} • Qty: {item.quantity || 1}
                          </p>
                        </div>

                        <span className="font-black text-orange-600">
                          RWF {Number(item.price || 0).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items found</p>
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 items-end mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Update Order Status
                  </label>
                  <select
                    value={order.order_status || "pending"}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="w-full p-3 border rounded-2xl bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="awaiting_payment">Awaiting Payment</option>
                    <option value="payment_submitted">Payment Submitted</option>
                    <option value="payment_verified">Payment Verified</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Update Payment Status
                  </label>
                  <select
                    value={order.payment_status || "pending"}
                    onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                    className="w-full p-3 border rounded-2xl bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    disabled={actionLoading === `delete-${order.id}`}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-60"
                  >
                    {actionLoading === `delete-${order.id}` ? "Deleting..." : "Delete Order"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => openDetails(order.id)}
                  className="px-4 py-2 rounded-2xl bg-gray-100 text-[#0b1120] font-bold hover:bg-gray-200 transition"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleQuickVerify(order)}
                  disabled={actionLoading === `payment-${order.id}`}
                  className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition disabled:opacity-60"
                >
                  Verify Payment
                </button>

                <button
                  onClick={() => handleQuickPreparing(order)}
                  disabled={actionLoading === `order-${order.id}`}
                  className="px-4 py-2 rounded-2xl bg-yellow-50 text-yellow-700 font-bold hover:bg-yellow-100 transition disabled:opacity-60"
                >
                  Mark Preparing
                </button>

                <button
                  onClick={() => handleQuickReady(order)}
                  disabled={actionLoading === `order-${order.id}`}
                  className="px-4 py-2 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition disabled:opacity-60"
                >
                  Mark Ready
                </button>

                <button
                  onClick={() => handleQuickCompleted(order)}
                  disabled={actionLoading === `order-${order.id}`}
                  className="px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition disabled:opacity-60"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 rounded-3xl shadow border border-gray-100 text-center">
            <p className="text-gray-500 font-medium">No orders found</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-[#0b1120]">
                  Order Details
                </h2>
                <p className="text-gray-500 mt-1">
                  Tracking Code: {selectedOrder.tracking_code || "-"}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-black text-[#0b1120]">
                  {selectedOrder.customer_name || "Guest"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-black text-[#0b1120]">
                  {selectedOrder.customer_phone || "-"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-black text-[#0b1120] capitalize">
                  {selectedOrder.payment_method || "cash"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-black text-green-600">
                  RWF {Number(selectedOrder.total_price || 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-black text-[#0b1120] capitalize">
                  {(selectedOrder.order_status || "pending").replaceAll("_", " ")}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-black text-[#0b1120] capitalize">
                  {(selectedOrder.payment_status || "pending").replaceAll("_", " ")}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-black text-[#0b1120]">
                  {selectedOrder.created_at
                    ? new Date(selectedOrder.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="font-black text-[#0b1120]">
                  {selectedOrder.updated_at
                    ? new Date(selectedOrder.updated_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-black text-[#0b1120] mb-4">
                Items
              </h3>

              <div className="space-y-3">
                {selectedOrder.items?.length ? (
                  selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border border-gray-100 rounded-2xl p-4"
                    >
                      <div>
                        <p className="font-black text-[#0b1120]">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          {item.category || "No category"} • Qty: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="font-black text-orange-600">
                        RWF {Number(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleQuickVerify(selectedOrder)}
                className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition"
              >
                Verify Payment
              </button>

              <button
                onClick={() => handleQuickPreparing(selectedOrder)}
                className="px-4 py-2 rounded-2xl bg-yellow-50 text-yellow-700 font-bold hover:bg-yellow-100 transition"
              >
                Mark Preparing
              </button>

              <button
                onClick={() => handleQuickReady(selectedOrder)}
                className="px-4 py-2 rounded-2xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition"
              >
                Mark Ready
              </button>

              <button
                onClick={() => handleQuickCompleted(selectedOrder)}
                className="px-4 py-2 rounded-2xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition"
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

