import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Ijisho Art Space
            </h3>
            <p className="text-sm">
              Celebrating Rwandan culture through paintings and handmade
              heritage items. Discover the beauty of our traditions.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/admin/login" className="hover:text-white">Admin</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
              Contact
            </h4>
            <p className="text-sm">Kigali, Rwanda</p>
            <p className="text-sm">info@ijishoartspace.com</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Ijisho Art Space. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
