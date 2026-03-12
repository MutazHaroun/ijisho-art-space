const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  login,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getAdminArtworks,
  getAdminMessages,
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

router.post("/login", login);

router.get("/artworks", auth, getAdminArtworks);
router.get("/messages", auth, getAdminMessages);

router.post("/artworks", auth, handleUpload, createArtwork);
router.put("/artworks/:id", auth, handleUpload, updateArtwork);
router.delete("/artworks/:id", auth, deleteArtwork);

module.exports = router;