const pool = require("../db");

// GET /api/gallery  — list all artworks, optional ?category=Art|Heritage&status=Available|Sold
async function getAllArtworks(req, res) {
  try {
    const { category, status } = req.query;
    let query = "SELECT * FROM artworks";
    const conditions = [];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    query += " ORDER BY created_at DESC";

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error("getAllArtworks error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/gallery/:id  — single artwork
async function getArtworkById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM artworks WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("getArtworkById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getAllArtworks, getArtworkById };
