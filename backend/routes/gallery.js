const express = require("express");
const router = express.Router();

const {
  getAllArtworks,
  getArtworkById,
  
} = require("../controllers/galleryController");

// ---------------- Public Routes ----------------

// جلب كل الأعمال الفنية
router.get("/", getAllArtworks);

// جلب عمل فني واحد
router.get("/:id", getArtworkById);


module.exports = router;
