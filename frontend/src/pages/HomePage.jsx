import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ArtworkCard from "../components/ArtworkCard";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/gallery?status=Available")
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-accent-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Ijisho Art Space
          </h1>
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-primary-100">
            Discover the beauty of Rwandan culture through stunning paintings
            and handmade heritage items crafted by talented local artists.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gallery"
              className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Explore Gallery
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-700 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We are a Kigali-based gallery dedicated to preserving and promoting
            Rwandan artistic traditions. From vibrant Imigongo paintings to
            intricately woven Agaseke baskets, we showcase the finest creations
            of Rwandan artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-primary-800 mb-3">
              Paintings & Art
            </h3>
            <p className="text-gray-700">
              Original artworks inspired by Rwanda's rolling hills, rich
              history, and vibrant daily life—created by emerging and
              established Rwandan artists.
            </p>
          </div>
          <div className="bg-accent-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-accent-800 mb-3">
              Heritage Items
            </h3>
            <p className="text-gray-700">
              Handmade crafts including Agaseke peace baskets, Imigongo art,
              beaded jewelry, and traditional pottery—each telling a story of
              Rwandan culture.
            </p>
          </div>
        </div>
      </section>

      {/* Featured works */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Works
            </h2>
            <p className="mt-2 text-gray-600">
              A selection of available pieces from our collection
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-gray-500">
              No featured artworks yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-block bg-primary-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
