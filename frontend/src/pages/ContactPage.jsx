import React from "react";
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Interested in a piece? Have a question about our gallery? Send us a
          message and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <ContactForm />

        {/* Info panel */}
        <div className="bg-gray-50 rounded-xl p-8 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
            <p className="text-gray-600">Kigali, Rwanda</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-gray-600">info@ijishoartspace.com</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
            <p className="text-gray-600">
              Monday – Saturday: 9:00 AM – 6:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Follow Us</h3>
            <p className="text-gray-600 text-sm">
              Find us on Instagram, Facebook, and Twitter for the latest
              additions to our collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
