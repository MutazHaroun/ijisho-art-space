import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-4">
          About Ijisho Art Space
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-[#0b1120] tracking-tight mb-4">
          Preserving Art, Culture, and Identity
        </h1>

        <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          Ijisho Art Space is a digital art gallery dedicated to showcasing
          Rwandan artworks and heritage pieces through a modern online platform.
          The system helps connect visitors with local artistic expression while
          preserving cultural identity in a professional and accessible way.
        </p>
      </section>

      {/* Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-[#0b1120] mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Many local galleries depend heavily on social media for promotion,
            which makes it difficult to organize collections, present artworks
            professionally, and preserve cultural records over time.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Ijisho Art Space was created as a digital solution to bring artworks,
            cultural objects, and visitor engagement into one centralized
            platform. It helps gallery owners manage their collection while
            giving visitors a beautiful and structured experience online.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-[#0b1120] mb-4">
            Cultural Importance
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Rwandan art reflects history, tradition, resilience, and identity.
            Paintings, handmade objects, and heritage pieces tell stories that
            should be preserved and shared beyond physical gallery walls.
          </p>
          <p className="text-gray-600 leading-relaxed">
            This platform supports that mission by making cultural collections
            easier to present, document, and discover for both local and
            international audiences.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Goals */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black text-[#0b1120] mb-3">Mission</h3>
          <p className="text-gray-600 leading-relaxed">
            To provide a professional digital gallery that promotes Rwandan art
            and heritage while supporting visibility, accessibility, and
            preservation.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black text-[#0b1120] mb-3">Vision</h3>
          <p className="text-gray-600 leading-relaxed">
            To become a trusted digital space where culture and creativity meet,
            allowing visitors to explore authentic artistic collections from
            anywhere.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-black text-[#0b1120] mb-3">Goal</h3>
          <p className="text-gray-600 leading-relaxed">
            To replace scattered promotion methods with a centralized system for
            viewing artworks, managing collections, and improving communication
            between the gallery and visitors.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-16">
        <h2 className="text-2xl font-black text-[#0b1120] mb-6 text-center">
          What the Platform Provides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h4 className="font-black text-[#0b1120] mb-2">Artwork Gallery</h4>
            <p className="text-sm text-gray-600">
              Visitors can explore artworks and heritage items in a clean and
              modern interface.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h4 className="font-black text-[#0b1120] mb-2">Search & Filters</h4>
            <p className="text-sm text-gray-600">
              Users can search, filter, and sort artworks to find pieces more
              easily.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h4 className="font-black text-[#0b1120] mb-2">Admin Dashboard</h4>
            <p className="text-sm text-gray-600">
              Gallery administrators can manage artworks, messages, and platform
              content efficiently.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h4 className="font-black text-[#0b1120] mb-2">Visitor Contact</h4>
            <p className="text-sm text-gray-600">
              Visitors can communicate directly with the gallery through the
              contact system.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="text-center">
        <h2 className="text-3xl font-black text-[#0b1120] mb-4">
          Art Beyond the Gallery Walls
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
          Ijisho Art Space is more than a website. It is a bridge between art,
          heritage, and digital innovation — helping preserve cultural value
          while opening the gallery to a wider audience.
        </p>
      </section>
    </div>
  );
}
