const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  login,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} = require("../controllers/adminController");
const {
  getAllArtworks,
} = require("../controllers/galleryController");
const { getMessages } = require("../controllers/contactController");

// ---- Public admin route ----
router.post("/login", login);

// ---- Protected admin routes ----
router.get("/artworks", authenticateToken, getAllArtworks);
router.post("/artworks", authenticateToken, upload.single("image"), createArtwork);
router.put("/artworks/:id", authenticateToken, upload.single("image"), updateArtwork);
router.delete("/artworks/:id", authenticateToken, deleteArtwork);
router.get("/messages", authenticateToken, getMessages);

module.exports = router;
