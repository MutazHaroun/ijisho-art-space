const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
const ordersRoutes = require("./routes/orders");
const artworkReviewsRoutes = require("./routes/artworkReviews");
const orderReviewsRoutes = require("./routes/orderReviews");

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required configuration
if (!process.env.JWT_SECRET) {
  console.error("Missing required environment variable: JWT_SECRET");
  process.exit(1);
}

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : [];

// --------------- Middleware ---------------
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (Postman, curl) where origin is undefined
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------- Routes ---------------

// Public routes
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/order-reviews", orderReviewsRoutes);

// Orders routes
app.use("/api/orders", ordersRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/artwork-reviews", artworkReviewsRoutes);

// --------------- Health check ---------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Ijisho Art Space API is running" });
});

// --------------- Start ---------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("✅ Orders route loaded at /api/orders");
});

module.exports = app;
