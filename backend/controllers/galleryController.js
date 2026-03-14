const pool = require("../db");
const fs = require("fs").promises;
const path = require("path");

// 1. جلب كل الأعمال الفنية مع البحث والفلترة
async function getAllArtworks(req, res) {
  try {
    const { search, category, status, page = 1, limit = 6, sort = "newest" } = req.query;

    let query = "SELECT * FROM artworks";
    let countQuery = "SELECT COUNT(*) FROM artworks";
    const conditions = [];
    const values = [];

    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (category && category !== "All") {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    if (status && status !== "All") {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      const whereClause = " WHERE " + conditions.join(" AND ");
      query += whereClause;
      countQuery += whereClause;
    }

    // Sorting
    if (sort === "oldest") {
      query += " ORDER BY created_at ASC";
    } else if (sort === "price_low") {
      query += " ORDER BY price ASC NULLS LAST";
    } else if (sort === "price_high") {
      query += " ORDER BY price DESC NULLS LAST";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageSize;

    values.push(pageSize);
    values.push(offset);

    query += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const artworksResult = await pool.query(query, values);

    const countValues = values.slice(0, values.length - 2);
    const countResult = await pool.query(countQuery, countValues);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    res.json({
      artworks: artworksResult.rows,
      currentPage: pageNumber,
      totalPages,
      totalItems,
    });
  } catch (err) {
    console.error("getAllArtworks error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}


// 2. جلب عمل فني واحد بواسطة الـ ID
async function getArtworkById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM artworks WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("getArtworkById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 3. إضافة عمل فني جديد
async function createArtwork(req, res) {
  try {
    const { title, artist, price, category, status, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const query = `
      INSERT INTO artworks (title, artist, price, category, status, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      title,
      artist,
      price || 0,
      category || "Art",
      status || "Available",
      description,
      imageUrl,
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "Artwork created successfully!",
      artwork: rows[0],
    });
  } catch (err) {
    console.error("createArtwork error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 4. حذف العمل الفني مع صورته
async function deleteArtwork(req, res) {
  try {
    const { id } = req.params;

    const findQuery = "SELECT image_url FROM artworks WHERE id = $1";
    const { rows } = await pool.query(findQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    const imageUrl = rows[0].image_url;

    await pool.query("DELETE FROM artworks WHERE id = $1", [id]);

    if (imageUrl) {
      const filePath = path.join(__dirname, "..", imageUrl);

      try {
        await fs.unlink(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
      } catch (fileErr) {
        console.error(
          "File deletion error (maybe file already gone):",
          fileErr
        );
      }
    }

    res.json({ message: "Artwork and associated image deleted successfully" });
  } catch (err) {
    console.error("deleteArtwork error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  deleteArtwork,
};
