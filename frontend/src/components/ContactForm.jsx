import React, { useState } from "react";
import api from "../api/axios";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await api.post("/contact", form);

      setStatus({
        type: "success",
        text: "Message sent! We'll get back to you soon.",
      });

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setStatus({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black text-gray-900 mb-2">Get in Touch</h2>
      <p className="text-gray-500 mb-8 text-sm font-medium">
        We'd love to hear from you. Send us a message below.
      </p>

      {status && (
        <div
          className={`mb-6 p-4 rounded-2xl text-sm font-bold border animate-in fade-in slide-in-from-top-4 duration-300 ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border-green-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}
        >
          {status.type === "success" ? "✅ " : "⚠️ "}
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Inquiry about Artwork"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1"
          >
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none transition-all duration-300 font-medium resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#0b1120] text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-600 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}

