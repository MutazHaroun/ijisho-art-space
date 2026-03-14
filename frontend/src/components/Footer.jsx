import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1120] text-gray-300 mt-20 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Ijisho <span className="text-orange-600">Art</span> Space
            </h3>

            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              A digital gallery platform dedicated to showcasing Rwandan art,
              heritage, and culture through a modern and accessible online
              experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">
              Quick Links
            </h4>

            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link
                  to="/"
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/gallery"
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  Gallery
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  Favorites
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-orange-500 transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-8">
              Connect With Us
            </h4>

            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <p>Kigali, Rwanda</p>
              </div>

              <div className="flex items-center gap-2">
                <span>✉️</span>
                <a
                  href="mailto:info@ijishoartspace.com"
                  className="hover:text-orange-500 transition-colors"
                >
                  info@ijishoartspace.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span>🕒</span>
                <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            © {currentYear} Ijisho Art Space. All rights reserved.
          </p>

          <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

