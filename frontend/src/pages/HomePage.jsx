import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ArtworkCard from "../components/ArtworkCard";
import AboutSection from "../components/AboutSection";

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

  const stats = [
  { label: "Art", value: "Paintings & Creative Works" },
  { label: "Heritage", value: "Cultural Objects" },
  {
    label: "Featured",
    value: loading ? "Loading..." : `${featured.length} Artworks`,
  },
];

  const highlights = [
    "Discover authentic Rwandan artworks",
    "Explore cultural heritage through a digital gallery",
    "Save favorites and connect with the gallery easily",
  ];

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* HERO SECTION */}
      <AboutSection
        eyebrow="WELCOME TO IJISHO ART SPACE"
        title="Discover Rwandan Art in a Modern Digital Space"
        image="/PIC1.jpg"
        paragraphs={[
          "Ijisho Art Space is a digital platform designed to present artworks and cultural heritage in a professional and accessible way.",
          "Visitors can explore creativity, identity, and tradition through one modern gallery experience.",
        ]}
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl transition-all hover:shadow-md"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{s.label}</p>
              <p className="font-black text-[#0b1120] dark:text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to="/gallery"
            className="px-8 py-4 bg-[#0b1120] dark:bg-orange-600 text-white font-bold rounded-xl text-center transition-transform active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none"
          >
            Explore Gallery
          </Link>

          <Link
            to="/about"
            className="px-8 py-4 bg-orange-600 dark:bg-gray-800 text-white font-bold rounded-xl text-center transition-transform active:scale-95"
          >
            Learn More
          </Link>
        </div>
      </AboutSection>

      {/* INTRO SECTION */}
      <AboutSection
        eyebrow="OUR STORY"
        title="A Platform for Art, Heritage, and Identity"
        image="/PIC2.jpg"
        reverse
        paragraphs={[
          "Ijisho Art Space provides a structured and professional way to present artworks beyond social media.",
          "The platform allows visitors to explore cultural collections while supporting artists and heritage preservation.",
        ]}
      />

      {/* HIGHLIGHTS SECTION */}
      <AboutSection
        eyebrow="WHY VISIT"
        title="More Than a Gallery Website"
        image="/PIC3.jpg"
        paragraphs={[
          "The platform is designed to make the gallery experience easier, richer, and more accessible for every visitor.",
        ]}
      >
        <ul className="space-y-4 text-gray-600 dark:text-gray-300 mt-6">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-2.5 w-2.5 bg-orange-500 rounded-full flex-shrink-0"></span>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </AboutSection>

      {/* CULTURE SECTION */}
      <AboutSection
        eyebrow="CULTURAL VALUE"
        title="Preserving Heritage Through Technology"
        image="/PIC5.jpg"
        paragraphs={[
          "Art and heritage pieces carry stories of identity, memory, and tradition.",
          "Ijisho Art Space helps preserve these cultural values through a modern digital platform.",
        ]}
      />

      {/* CTA SECTION */}
      <AboutSection
        eyebrow="EXPLORE IJISHO"
        title="Experience Art Beyond the Gallery Walls"
        image="/PIC6.jpg"
        reverse
        paragraphs={[
          "Explore the collection, save your favorite artworks, and connect with the gallery through one modern platform.",
        ]}
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
          <Link
            to="/gallery"
            className="px-10 py-4 bg-[#0b1120] dark:bg-orange-600 text-white font-extrabold rounded-xl text-center transition-all hover:opacity-90"
          >
            Visit Gallery
          </Link>

          <Link
            to="/contact"
            className="px-10 py-4 bg-orange-600 dark:bg-gray-800 text-white font-extrabold rounded-xl text-center transition-all hover:opacity-90"
          >
            Contact Us
          </Link>
        </div>
      </AboutSection>

      {/* FEATURED WORKS SECTION */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
              <span className="text-orange-600 font-black tracking-[0.2em] uppercase text-sm">Featured Collection</span>
              <h2 className="text-4xl font-black text-[#0b1120] dark:text-white mt-2">Featured Works</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">A curated selection of artworks available in the gallery.</p>
           </div>

          {loading ? (
            <div className="flex justify-center py-10">
               <p className="text-gray-500 dark:text-gray-400 animate-pulse font-bold">Loading masterpieces...</p>
            </div>
          ) : featured.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-10">
              No featured artworks available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.slice(0, 25).map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <Link
              to="/gallery"
              className="group flex items-center gap-3 px-8 py-4 bg-[#0b1120] dark:bg-white dark:text-[#0b1120] text-white font-black rounded-2xl transition-all hover:gap-5"
            >
              View Full Gallery
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

