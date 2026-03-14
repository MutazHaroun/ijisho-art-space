const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const upload = require("../middleware/upload");

const {
  register,
  login,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getAdminArtworks,
  getAdminMessages,
  deleteMessage,
  getAdminProfile,
  updateAdminProfile,
} = require("../controllers/adminController");

function handleUpload(req, res, next) {
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("upload error:", err);
      return res.status(500).json({
        error: err.message || "Image upload failed",
      });
    }
    next();
  });
}

// ---------------- Public Routes ----------------

// تسجيل مستخدم عادي
router.post("/register", register);

// تسجيل دخول موحد
router.post("/login", login);

// ---------------- Admin Protected Routes ----------------

// الأعمال الفنية
router.get("/artworks", auth, adminOnly, getAdminArtworks);
router.post("/artworks", auth, adminOnly, handleUpload, createArtwork);
router.put("/artworks/:id", auth, adminOnly, handleUpload, updateArtwork);
router.delete("/artworks/:id", auth, adminOnly, deleteArtwork);

// الرسائل
router.get("/messages", auth, adminOnly, getAdminMessages);
router.delete("/messages/:id", auth, adminOnly, deleteMessage);

// الأدمن بروفايل
router.get("/profile", auth, adminOnly, getAdminProfile);
router.put("/profile", auth, adminOnly, updateAdminProfile);

module.exports = router;
