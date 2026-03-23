import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [method, setMethod] = useState("mtn_momo");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!method) {
      toast.error("Please select payment method");
      return;
    }

    if ((method === "mtn_momo" || method === "airtel_money") && !phoneNumber.trim()) {
      toast.error("Please enter payment phone number");
      return;
    }

    if (!reference.trim()) {
      toast.error("Please enter transaction/reference number");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/orders/${id}/payment`, {
        method,
        amount: order.total_price,
        phone_number: phoneNumber,
        transaction_reference: reference,
      });

      toast.success("Payment submitted successfully");
      navigate(`/track-order`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center font-bold">Loading payment page...</div>;
  }

  if (!order) {
    return <div className="p-10 text-center font-bold">Order not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="inline-block px-4 py-1 rounded-full bg-green-50 text-green-600 text-sm font-bold mb-4">
          Payment
        </span>

        <h1 className="text-4xl font-black text-[#0b1120] mb-3">
          Complete Payment
        </h1>

        <p className="text-gray-500">
          Choose your payment method and submit transaction details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-2xl font-black text-[#0b1120] mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Tracking Code</span>
              <span className="font-bold">{order.tracking_code}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-bold">{order.customer_name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-black text-green-600">
                ${Number(order.total_price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span className="font-bold">${Number(item.price || 0)}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmitPayment}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="text-2xl font-black text-[#0b1120] mb-6">
            Payment Details
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Payment Method
              </label>

              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500"
              >
                <option value="mtn_momo">MTN MoMo</option>
                <option value="airtel_money">Airtel Money</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {(method === "mtn_momo" || method === "airtel_money") && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Payment Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone used for payment"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Transaction / Reference Number
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter transaction reference"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:bg-white focus:border-orange-500"
              />
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              {method === "mtn_momo" && (
                <p>Pay using MTN MoMo, then submit the transaction reference here.</p>
              )}

              {method === "airtel_money" && (
                <p>Pay using Airtel Money, then submit the transaction reference here.</p>
              )}

              {method === "bank_transfer" && (
                <p>Make a bank transfer, then submit the bank reference here.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-5 py-3 rounded-2xl bg-[#0b1120] text-white font-bold hover:bg-orange-600 transition-all disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

