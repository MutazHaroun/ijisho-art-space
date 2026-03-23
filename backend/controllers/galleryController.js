const pool = require("../db");
const fs = require("fs").promises;
const path = require("path");

// 1. جلب كل الأعمال الفنية مع البحث والفلترة + التقييم
async function getAllArtworks(req, res) {
  try {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 6,
      sort = "newest",
    } = req.query;

    let query = `
      SELECT
        artworks.*,
        COALESCE(review_stats.reviews_count, 0) AS reviews_count,
        COALESCE(review_stats.average_rating, 0) AS average_rating
      FROM artworks
      LEFT JOIN (
        SELECT
          artwork_id,
          COUNT(*)::int AS reviews_count,
          COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average_rating
        FROM reviews
        GROUP BY artwork_id
      ) AS review_stats
      ON review_stats.artwork_id::text = artworks.id::text
    `;

    let countQuery = "SELECT COUNT(*) FROM artworks";
    const conditions = [];
    const values = [];

    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      conditions.push(`artworks.title ILIKE $${values.length}`);
    }

    if (category && category !== "All") {
      values.push(category);
      conditions.push(`artworks.category = $${values.length}`);
    }

    if (status && status !== "All") {
      values.push(status);
      conditions.push(`artworks.status = $${values.length}`);
    }

    if (conditions.length > 0) {
      const whereClause = " WHERE " + conditions.join(" AND ");
      query += whereClause;
      countQuery += whereClause.replaceAll("artworks.", "");
    }

    // Sorting Logic
    if (sort === "oldest") {
      query += " ORDER BY artworks.created_at ASC";
    } else if (sort === "price_low") {
      query += " ORDER BY artworks.price ASC NULLS LAST";
    } else if (sort === "price_high") {
      query += " ORDER BY artworks.price DESC NULLS LAST";
    } else {
      query += " ORDER BY artworks.created_at DESC";
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

// 2. جلب عمل فني واحد مع التقييمات وقائمة المراجعات
async function getArtworkById(req, res) {
  try {
    const { id } = req.params;

    // جلب بيانات العمل والمتوسط
    const artworkResult = await pool.query(
      `
      SELECT
        artworks.*,
        COALESCE(review_stats.reviews_count, 0) AS reviews_count,
        COALESCE(review_stats.average_rating, 0) AS average_rating
      FROM artworks
      LEFT JOIN (
        SELECT
          artwork_id,
          COUNT(*)::int AS reviews_count,
          COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average_rating
        FROM reviews
        GROUP BY artwork_id
      ) AS review_stats
      ON review_stats.artwork_id = artworks.id
      WHERE artworks.id::text = $1
      `,
      [id]
    );

    if (artworkResult.rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    // جلب قائمة المراجعات الفعلية (التعليقات) لهذا العمل
    const reviewsResult = await pool.query(
      "SELECT * FROM reviews WHERE artwork_id = $1 ORDER BY created_at DESC",
      [id]
    );

    const artwork = artworkResult.rows[0];
    artwork.reviews = reviewsResult.rows; // ندمج التعليقات في كائن العمل الفني

    res.json(artwork);
  } catch (err) {
    console.error("getArtworkById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 3. إضافة مراجعة جديدة (NEW)
async function addReview(req, res) {
  try {
    const { id } = req.params; // Artwork UUID
    const { rating, comment, customer_name } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const query = `
      INSERT INTO reviews (artwork_id, rating, comment, customer_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id, rating, comment, customer_name || 'Guest']);

    res.status(201).json({
      message: "Review added successfully!",
      review: rows[0],
    });
  } catch (err) {
    console.error("addReview error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 4. إضافة عمل فني جديد
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

// 5. حذف العمل الفني مع صورته
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
      } catch (fileErr) {
        console.error("File deletion error:", fileErr);
      }
    }

    res.json({ message: "Artwork and associated image deleted successfully" });
  } catch (err) {
    console.error("deleteArtwork error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// حذف مراجعة معينة (للأدمن فقط)
async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    // التأكد من وجود المراجعة قبل الحذف
    const findReview = await pool.query("SELECT * FROM reviews WHERE id = $1", [reviewId]);
    
    if (findReview.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("deleteReview error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// لا تنسَ إضافة deleteReview إلى module.exports في أسفل الملف

module.exports = {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  deleteArtwork,
  addReview, // لا تنسَ تصدير الدالة الجديدة
  deleteReview,
};
