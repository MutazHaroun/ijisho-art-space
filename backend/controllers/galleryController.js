const pool = require("../db");
const fs = require("fs").promises; // نحتاج fs للتعامل مع الملفات
const path = require("path");

// 1. جلب كل الأعمال الفنية
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

// 2. جلب عمل فني واحد بواسطة الـ ID
async function getArtworkById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM artworks WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("getArtworkById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 3. إضافة عمل فني جديد (POST)
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
      category || 'Art',
      status || 'Available',
      description,
      imageUrl
    ];

    const { rows } = await pool.query(query, values);

    res.status(201).json({
      message: "Artwork created successfully!",
      artwork: rows[0]
    });
  } catch (err) {
    console.error("createArtwork error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// 4. ميزة الحذف الجديدة: حذف العمل الفني وصورته
async function deleteArtwork(req, res) {
  try {
    const { id } = req.params;

    // أولاً: جلب بيانات العمل للحصول على مسار الصورة قبل الحذف
    const findQuery = "SELECT image_url FROM artworks WHERE id = $1";
    const { rows } = await pool.query(findQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    const imageUrl = rows[0].image_url;

    // ثانياً: حذف السجل من قاعدة البيانات
    await pool.query("DELETE FROM artworks WHERE id = $1", [id]);

    // ثالثاً: حذف ملف الصورة من السيرفر (Physical Delete)
    if (imageUrl) {
      // بناء المسار الحقيقي للملف على القرص الصلب
      // imageUrl تكون عادة "/uploads/filename.jpg"
      const filePath = path.join(__dirname, "..", imageUrl);
      
      try {
        await fs.unlink(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
      } catch (fileErr) {
        // نكتفي بطباعة الخطأ إذا لم نجد الملف، لنمنع توقف العملية
        console.error("File deletion error (maybe file already gone):", fileErr);
      }
    }

    res.json({ message: "Artwork and associated image deleted successfully" });
  } catch (err) {
    console.error("deleteArtwork error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// تصدير الدوال المحدثة
module.exports = { 
  getAllArtworks, 
  getArtworkById, 
  createArtwork,
  deleteArtwork // تصدير الدالة الجديدة
};