const express = require("express");
const router = express.Router();

console.log("gallery reviews POST route loaded");

const {
  getAllArtworks,
  getArtworkById,
  addReview,
} = require("../controllers/galleryController");

// ---------------- Public Routes ----------------

// جلب كل الأعمال الفنية
router.get("/", getAllArtworks);

// إضافة مراجعة جديدة
router.post("/:id/reviews", addReview);

// جلب عمل فني واحد
router.get("/:id", getArtworkById);


module.exports = router;
