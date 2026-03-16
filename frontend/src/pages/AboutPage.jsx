import React from "react";
import AboutSection from "../components/AboutSection";

export default function AboutPage() {
  const stats = [
    { label: "Focus", value: "Rwandan Art & Heritage" },
    { label: "Platform", value: "Web-based System" },
    { label: "Tech", value: "React • Node.js • PostgreSQL" },
  ];

  const features = [
    "Artwork Gallery (clean and organized browsing)",
    "Search & Filters (find artworks faster)",
    "Favorites (save artworks you like)",
    "Admin Dashboard (manage artworks and messages)",
    "Visitor Contact (direct communication)",
    "Cultural Preservation (documentation and archive)",
  ];

  return (
    <div className="bg-gray-50">
      {/* HERO */}
      <AboutSection
        eyebrow="ABOUT IJISHO ART SPACE"
        title="Preserving Art, Culture, and Identity"
        image="/PIC1.jpg"
        paragraphs={[
          "Ijisho Art Space is a digital art gallery dedicated to showcasing Rwandan artworks and heritage pieces through a modern online platform.",
          "The system connects visitors with local artistic expression while preserving cultural identity in a professional and accessible way.",
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-bold">{s.label}</p>
              <p className="font-black text-[#0b1120]">{s.value}</p>
            </div>
          ))}
        </div>
      </AboutSection>

      {/* OUR STORY */}
      <AboutSection
        eyebrow="OUR STORY"
        title="From Social Media to a Structured Gallery"
        image="/PIC2.jpg"
        reverse
        paragraphs={[
          "Many local galleries depend heavily on social media for promotion. While these platforms help increase visibility, they often lack proper organization for artworks.",
          "Ijisho Art Space was created as a digital solution that brings artworks, cultural objects, and visitor engagement into one centralized platform.",
        ]}
      />

      {/* CULTURAL IMPORTANCE */}
      <AboutSection
        eyebrow="CULTURAL IMPORTANCE"
        title="Heritage That Deserves to Be Preserved"
        image="/PIC3.jpg"
        paragraphs={[
          "Rwandan art reflects history, tradition, resilience, and identity. Cultural objects and paintings tell stories that should be preserved and shared with future generations.",
          "Digital platforms make it possible to present and document artworks in a way that is accessible to both local and international audiences.",
        ]}
      />

      {/* MISSION */}
      <AboutSection
        eyebrow="MISSION"
        title="Why We Built This Platform"
        image="/PIC4.jpg"
        reverse
        paragraphs={[
          "The mission of Ijisho Art Space is to provide a professional digital environment where artworks and cultural heritage can be presented and preserved.",
          "The platform improves accessibility while supporting artists and cultural institutions.",
        ]}
      />

      {/* VISION */}
      <AboutSection
        eyebrow="VISION"
        title="A Trusted Digital Space for Culture"
        image="/PIC5.jpg"
        paragraphs={[
          "Our vision is to create a trusted digital space where culture and creativity meet.",
          "Visitors from anywhere in the world can explore authentic Rwandan artistic collections.",
        ]}
      />

      {/* GOAL */}
      <AboutSection
        eyebrow="GOAL"
        title="Centralized, Professional, Accessible"
        image="/PIC6.jpg"
        reverse
        paragraphs={[
          "The goal of the system is to replace scattered promotion methods with a centralized platform for viewing artworks.",
          "The platform improves collection management and communication between the gallery and visitors.",
        ]}
      />

      {/* FOUNDER */}
      <AboutSection
        eyebrow="OUR FOUNDER"
        title="PROSPER ISHIMWE"
        image="/OWNER.webp"
        chips={["Rwandan", "35 years old", "Gisenyi, Rwanda"]}
        paragraphs={[
          "Prosper Ishimwe is the founder and owner of Ijisho Art Space. He is passionate about promoting Rwandan creativity and preserving cultural heritage.",
          "Through this platform, he aims to showcase artworks professionally and make them accessible to a wider audience beyond the gallery’s physical location.",
        ]}
        quote="Art is a bridge between culture and the future — and it deserves a home that is accessible to everyone."
      />

      {/* FEATURES */}
      <AboutSection
        eyebrow="FEATURES"
        title="What the Platform Provides"
        image="/PIC7.jpg"
        reverse
        paragraphs={[
          "The system includes several features that improve presentation, accessibility, and management of artworks.",
        ]}
      >
        <ul className="space-y-3 text-gray-600 mt-4">
          {features.map((f) => (
            <li key={f} className="flex gap-3">
              <span className="mt-2 h-2 w-2 bg-orange-500 rounded-full"></span>
              {f}
            </li>
          ))}
        </ul>
      </AboutSection>

      {/* CLOSING */}
      <AboutSection
        eyebrow="IJISHO ART SPACE"
        title="Art Beyond the Gallery Walls"
        image="/PIC8.webp"
        paragraphs={[
          "Ijisho Art Space is more than a website. It is a bridge between art, heritage, and digital innovation.",
          "The platform helps preserve cultural value while opening the gallery to a wider audience.",
        ]}
      >
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <a
            href="/gallery"
            className="px-6 py-3 bg-[#0b1120] text-white font-bold rounded-xl"
          >
            Explore Gallery
          </a>

          <a
            href="/contact"
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl"
          >
            Contact Us
          </a>
        </div>
      </AboutSection>
    </div>
  );
}
