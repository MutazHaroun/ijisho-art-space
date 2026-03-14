import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ArtworkCard from "../components/ArtworkCard";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/gallery?status=Available&page=1&limit=6&sort=newest")
      .then((res) => setFeatured(res.data.artworks || []))
      .catch((err) => {
        console.error("Failed to load featured artworks:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-5">
              Digital Gallery Platform
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0b1120] dark:text-white leading-tight tracking-tight">
              Discover Rwandan Art in a Modern Digital Space
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              Ijisho Art Space is a digital platform designed to present
              artworks and cultural heritage in a professional, accessible, and
              visually engaging way. It connects visitors with creativity,
              identity, and tradition through one modern gallery experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/gallery"
                className="px-6 py-3 rounded-2xl bg-[#0b1120] text-white font-bold shadow-lg hover:bg-orange-600 transition-all"
              >
                Explore Gallery
              </Link>

              <Link
                to="/about"
                className="px-6 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-white font-bold hover:border-orange-500 hover:text-orange-600 transition-all"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
                <h3 className="text-2xl font-black text-[#0b1120] dark:text-white">
                  Art
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Paintings and creative works
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
                <h3 className="text-2xl font-black text-orange-600">
                  Heritage
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Cultural and traditional pieces
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
                <h3 className="text-2xl font-black text-blue-600">Digital</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Accessible from anywhere
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
                <h3 className="text-2xl font-black text-purple-600">
                  {loading ? "..." : featured.length}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Featured artworks
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-70"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-70"></div>

            <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-[2rem] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80"
                alt="Art gallery"
                className="w-full h-[420px] object-cover"
              />

              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-[#0b1120] dark:text-white">
                      Ijisho Art Space
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                      Preserving culture through art and technology
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-black">
                    Live Gallery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b1120] dark:text-white">
              A Platform for Art, Heritage, and Identity
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We are building a modern digital experience that helps preserve
              and present Rwandan culture through artworks and heritage pieces.
              Instead of relying only on social media, Ijisho Art Space offers a
              structured and professional online gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-black text-[#0b1120] dark:text-white mb-3">
                Paintings & Art
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Original artworks inspired by Rwanda’s landscapes, memory,
                history, and everyday life.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-black text-[#0b1120] dark:text-white mb-3">
                Heritage Items
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Handmade crafts and cultural objects that reflect Rwandan
                traditions, symbolism, and identity.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-black text-[#0b1120] dark:text-white mb-3">
                Digital Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Visitors can explore collections, save favorites, and contact
                the gallery through one centralized platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4">
              Featured Collection
            </span>

            <h2 className="text-3xl md:text-4xl font-black text-[#0b1120] dark:text-white">
              Featured Works
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A curated selection of available pieces from our gallery
              collection.
            </p>

            {!loading && (
              <div className="mt-5 flex justify-center">
                <span className="px-4 py-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-black text-[#0b1120] dark:text-white shadow-sm">
                  {featured.length} Featured Artwork(s)
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                      <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center shadow-sm">
              <h3 className="text-2xl font-black text-[#0b1120] dark:text-white mb-3">
                No featured artworks yet
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
                Check back soon to discover new pieces from the collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-block px-6 py-3 rounded-2xl bg-[#0b1120] text-white font-bold shadow-lg hover:bg-orange-600 transition-all"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="bg-[#0b1120] rounded-[2rem] p-10 md:p-14 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Experience Art Beyond the Gallery Walls
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Explore the collection, save your favorite pieces, and connect with
            the gallery through a modern and immersive digital experience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/gallery"
              className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold hover:bg-white hover:text-[#0b1120] transition-all"
            >
              Visit Gallery
            </Link>

            <Link
              to="/contact"
              className="px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-[#0b1120] transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

