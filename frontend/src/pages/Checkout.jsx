import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function Checkout() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [loading, setLoading] = useState(false);

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const userId = localStorage.getItem("userId") || null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number");
      return;
    }

    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
        })),
        total_price: totalPrice,
        payment_method: paymentMethod,
        payment_phone: customerPhone,
        user_id: userId,
      };

      const { data } = await api.post("/orders", payload);

      const createdOrder = data.order;

      if (!createdOrder?.id) {
        toast.error("Order created but order ID is missing");
        return;
      }

      localStorage.setItem("lastOrderId", createdOrder.id);
      localStorage.setItem("lastTrackingCode", createdOrder.tracking_code || "");
      localStorage.removeItem("cart");

      toast.success("Order created successfully");

      if (paymentMethod === "cash") {
        navigate("/my-orders");
      } else {
        navigate(`/payment/${createdOrder.id}`);
      }
    } catch (error) {
      console.error("Create order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-8">
        <h1 className="text-3xl font-black text-[#0b1120] mb-6">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            >
              <option value="cash">Cash</option>
              <option value="momo">MTN MoMo</option>
              <option value="airtel">Airtel Money</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-500 mb-2">Total Amount</p>
            <h2 className="text-2xl font-black text-green-600">
              RWF {totalPrice.toLocaleString()}
            </h2>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b1120] text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
