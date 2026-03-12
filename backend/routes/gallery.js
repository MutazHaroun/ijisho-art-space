
const express = require("express");
const router = express.Router();
const {
  getAllArtworks,
  getArtworkById,
} = require("../controllers/galleryController");

// Public routes
router.get("/", getAllArtworks);
router.get("/:id", getArtworkById);

module.exports = router;
