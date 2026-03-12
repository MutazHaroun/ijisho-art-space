const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
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
