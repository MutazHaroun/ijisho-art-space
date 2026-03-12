const express = require("express");

const cors = require("cors");
const path = require("path");
require("dotenv").config();

const galleryRoutes = require("./routes/gallery");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");
// const UserRouter = require('./routes/users')

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------- Routes ---------------
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/users", UserRouter);
// --------------- Health check ---------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --------------- Start ---------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
