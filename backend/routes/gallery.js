const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // تأكد أن المسار يؤدي لملف Multer الخاص بك
const {
  getAllArtworks,
  getArtworkById,
  createArtwork, // إضافة الدالة الجديدة هنا
} = require("../controllers/galleryController");

// ---------------- Public Routes (للعرض) ----------------
router.get("/", getAllArtworks);
router.get("/:id", getArtworkById);

// ---------------- Admin Routes (للإضافة) ----------------
// 'image' هو الاسم الذي يجب أن تستخدمه في الـ Frontend داخل الـ FormData
router.post("/", upload.single("image"), createArtwork);

module.exports = router;
