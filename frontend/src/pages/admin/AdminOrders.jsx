import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );

      toast.success("Order status updated");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const deleteOrder = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;

    try {
      await api.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast.info("Order deleted");
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Confirmed") {
      return "bg-green-50 text-green-600";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-600";
    }

    return "bg-orange-50 text-orange-600";
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-black text-[#0b1120] mb-6">Orders</h1>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-black text-[#0b1120] mb-6">Orders</h1>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500 text-lg">No orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-[#0b1120]">Orders</h1>
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
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-bold text-[#0b1120]">
                      {order.customer_name || "Guest Customer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-bold text-[#0b1120]">
                      {order.customer_phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Items Count</p>
                    <p className="font-bold text-[#0b1120]">
                      {order.items?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-full font-bold ${getStatusBadge(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white font-bold text-[#0b1120] focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => deleteOrder(order.id)}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
                >
                  Delete
                </button>
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
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>

                  <p className="font-bold text-orange-600">
                    ${Number(item.price || 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-right">
              <p className="text-lg font-black text-[#0b1120]">
                Total: ${Number(order.total_price || 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

