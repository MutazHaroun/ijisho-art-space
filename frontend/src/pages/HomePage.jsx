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
    { label: "Featured", value: loading ? "..." : featured.length },
  ];

  const highlights = [
    "Discover authentic Rwandan artworks",
    "Explore cultural heritage through a digital gallery",
    "Save favorites and connect with the gallery easily",
  ];

  return (
    <div className="bg-white">
      {/* HERO */}
      <AboutSection
        eyebrow="WELCOME TO IJISHO ART SPACE"
        title="Discover Rwandan Art in a Modern Digital Space"
        image="/PIC1.jpg"
        paragraphs={[
          "Ijisho Art Space is a digital platform designed to present artworks and cultural heritage in a professional and accessible way.",
          "Visitors can explore creativity, identity, and tradition through one modern gallery experience.",
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 p-4 rounded-xl"
            >
              <p className="text-xs text-gray-500 font-bold">{s.label}</p>
              <p className="font-black text-[#0b1120]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/gallery"
            className="px-6 py-3 bg-[#0b1120] text-white font-bold rounded-xl"
          >
            Explore Gallery
          </Link>

          <Link
            to="/about"
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl"
          >
            Learn More
          </Link>
        </div>
      </AboutSection>

      {/* INTRO */}
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

      {/* HIGHLIGHTS */}
      <AboutSection
        eyebrow="WHY VISIT"
        title="More Than a Gallery Website"
        image="/PIC3.jpg"
        paragraphs={[
          "The platform is designed to make the gallery experience easier, richer, and more accessible for every visitor.",
        ]}
      >
        <ul className="space-y-3 text-gray-600 mt-4">
          {highlights.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2 w-2 bg-orange-500 rounded-full"></span>
              {item}
            </li>
          ))}
        </ul>
      </AboutSection>

      {/* CULTURE */}
      <AboutSection
        eyebrow="CULTURAL VALUE"
        title="Preserving Heritage Through Technology"
        image="/PIC5.jpg"
        paragraphs={[
          "Art and heritage pieces carry stories of identity, memory, and tradition.",
          "Ijisho Art Space helps preserve these cultural values through a modern digital platform.",
        ]}
      />

      {/* CTA */}
      <AboutSection
        eyebrow="EXPLORE IJISHO"
        title="Experience Art Beyond the Gallery Walls"
        image="/PIC6.jpg"
        reverse
        paragraphs={[
          "Explore the collection, save your favorite artworks, and connect with the gallery through one modern platform.",
        ]}
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <Link
            to="/gallery"
            className="px-6 py-3 bg-[#0b1120] text-white font-bold rounded-xl text-center"
          >
            Visit Gallery
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl text-center"
          >
            Contact Us
          </Link>
        </div>
      </AboutSection>

      {/* FEATURED WORKS - LAST SECTION WITHOUT IMAGE */}
      <AboutSection
        eyebrow="FEATURED COLLECTION"
        title="Featured Works"
        paragraphs={[
          "A curated selection of artworks available in the gallery.",
        ]}
      >
        {loading ? (
          <p className="text-gray-500 text-center">Loading artworks...</p>
        ) : featured.length === 0 ? (
          <p className="text-gray-500 text-center">
            No featured artworks available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 text-left">
            {featured.slice(0, 4).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            to="/gallery"
            className="px-6 py-3 bg-[#0b1120] text-white font-bold rounded-xl text-center"
          >
            View Full Gallery
          </Link>
        </div>
      </AboutSection>
    </div>
  );
}

