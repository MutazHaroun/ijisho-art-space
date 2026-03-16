import React from "react";

export default function AboutSection({
  eyebrow,
  title,
  paragraphs = [],
  image,
  reverse = false,
  grayscale = false,
  chips = [],
  quote,
  children,
}) {
  const hasImage = Boolean(image);

  return (
    <section className="w-full bg-white border-y border-gray-100 overflow-hidden">
      <div
        className={`mx-auto max-w-7xl ${
          hasImage
            ? "grid grid-cols-1 lg:grid-cols-2 min-h-[420px] lg:min-h-[620px]"
            : "block"
        }`}
      >
        {/* Image */}
        {hasImage && (
          <div
            className={`relative bg-white flex items-center justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 ${
              reverse ? "lg:order-2" : "lg:order-1"
            }`}
          >
            <div className="w-full">
              <img
                src={image}
                alt={title}
                className={`w-full max-h-[260px] sm:max-h-[320px] lg:max-h-[420px] object-cover rounded-2xl shadow-md transition duration-300 hover:scale-[1.02] ${
                  grayscale ? "grayscale" : ""
                }`}
              />
            </div>
          </div>
        )}

        {/* Text */}
        <div
          className={`flex items-center bg-white ${
            hasImage
              ? reverse
                ? "lg:order-1"
                : "lg:order-2"
              : "justify-center"
          }`}
        >
          <div
            className={`w-full px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 ${
              hasImage ? "max-w-2xl" : "max-w-4xl mx-auto text-center"
            }`}
          >
            {eyebrow && (
              <p className="tracking-[0.35em] text-[11px] sm:text-xs font-bold text-orange-600 mb-5 uppercase">
                {eyebrow}
              </p>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1120] leading-tight mb-6">
              {title}
            </h2>

            {!!chips.length && (
              <div
                className={`flex flex-wrap gap-2 mb-6 ${
                  hasImage ? "" : "justify-center"
                }`}
              >
                {chips.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-gray-600 text-base sm:text-lg leading-8"
                >
                  {p}
                </p>
              ))}
            </div>

            {quote && (
              <div
                className={`mt-8 border-orange-500 ${
                  hasImage
                    ? "border-l-4 pl-4 sm:pl-5"
                    : "border-t-4 pt-4 max-w-2xl mx-auto"
                }`}
              >
                <p className="text-sm sm:text-base text-gray-600 italic leading-7">
                  {quote}
                </p>
              </div>
            )}

            {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
