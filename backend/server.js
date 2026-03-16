const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

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

// 1. مسارات المعرض والاتصال
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);

// 2. مسارات الإدارة والدخول (التعديل هنا)
// قمنا بتغيير البادئة لـ /api/admin لتطابق طلبات الـ React
// الآن ستعمل الروابط التالية:
// /api/admin/login
// /api/admin/register
// /api/admin/artworks
// /api/admin/messages
app.use("/api/admin", adminRoutes); 

// --------------- Health check ---------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Ijisho Art Space API is running" });
});

// --------------- Start ---------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
