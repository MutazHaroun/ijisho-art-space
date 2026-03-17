import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { FaTrash, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const getFullImageUrl = (path) => {
    if (!path) return "https://placehold.co/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        setItems([]);
        return;
      }

      const responses = await Promise.all(
        cart.map((id) => api.get(`/gallery/${id}`))
      );

      setItems(responses.map((r) => r.data));
    } catch (error) {
      console.error("Failed to load cart items:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const removeFromCart = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((itemId) => String(itemId) !== String(id));

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Removed from cart");
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setItems([]);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Cart cleared");
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const whatsappMessage = encodeURIComponent(
    items.length > 0
      ? `Hello, my name is ${customerName || "Guest Customer"}.
My phone number is ${customerPhone || "Not provided"}.

I am interested in these artworks:

${items
  .map(
    (item, index) =>
      `${index + 1}. ${item.title} - $${Number(item.price || 0).toLocaleString()}`
  )
  .join("\n")}

Total: $${totalPrice.toLocaleString()}`
      : "Hello, I am interested in artworks from Ijisho Art Space."
  );

  const whatsappUrl = `https://wa.me/250789781166?text=${whatsappMessage}`;

  const handleWhatsAppOrder = async () => {
    if (items.length === 0) {
      toast.info("Your cart is empty");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!customerPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    try {
      setSubmittingOrder(true);

      await api.post("/orders", {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          price: Number(item.price || 0),
          category: item.category || "Uncategorized",
        })),
        total_price: totalPrice,
      });

      toast.success("Order saved successfully");

      localStorage.removeItem("cart");
      setItems([]);
      setCustomerName("");
      setCustomerPhone("");
      window.dispatchEvent(new Event("cartUpdated"));

      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Failed to save order:", error);
      toast.error("Failed to save order");
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-black mb-8 text-[#0b1120]">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 animate-pulse"
            >
              <div className="h-60 w-full rounded-2xl bg-gray-200 mb-4"></div>
              <div className="h-6 w-2/3 bg-gray-200 rounded mb-3"></div>
              <div className="h-5 w-24 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-black text-[#0b1120] mb-3">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mb-8">
          Add some artworks to your cart and they will appear here.
        </p>

        <Link
          to="/gallery"
          className="inline-block px-6 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all"
        >
          Explore Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: Cart Items */}
        <div className="w-full lg:w-2/3">
          <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4">
            Your Selection
          </span>

          <h1 className="text-4xl font-black text-[#0b1120] mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4"
              >
                <img
                  src={getFullImageUrl(item.image_url)}
                  alt={item.title}
                  className="h-64 w-full object-cover rounded-2xl"
                />

                <div className="mt-4">
                  <h3 className="font-black text-xl text-[#0b1120] mb-2">
                    {item.title}
                  </h3>

                  {item.category && (
                    <p className="text-sm text-gray-500 mb-2">
                      Category: {item.category}
                    </p>
                  )}

                  <p className="text-lg font-bold text-orange-600">
                    ${Number(item.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    to={`/gallery/${item.id}`}
                    className="px-4 py-2 rounded-xl bg-[#0b1120] text-white text-sm font-bold hover:bg-orange-600 transition-all"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-28">
            <h2 className="text-2xl font-black text-[#0b1120] mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="font-bold text-[#0b1120]">{items.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Price</span>
                <span className="font-bold text-[#0b1120]">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-[#0b1120] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0b1120] mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              disabled={submittingOrder}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FaWhatsapp className="text-lg" />
              {submittingOrder ? "Saving Order..." : "Contact on WhatsApp"}
            </button>

            <Link
              to="/gallery"
              className="mt-3 w-full inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all"
            >
              Continue Shopping
            </Link>

            <button
              onClick={clearCart}
              className="mt-3 w-full inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

