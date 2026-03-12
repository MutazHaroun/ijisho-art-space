const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

/**
 * 1. تسجيل مستخدم جديد (Register)
 * معدل ليرسل التوكن فوراً للسماح بالدخول التلقائي
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إدخال المستخدم في قاعدة البيانات
    const { rows } = await pool.query(
      `INSERT INTO users (id, names, email, password, role) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4) 
       RETURNING id, names, email, role`,
      [name, email, hashedPassword, "user"]
    );

    const user = rows[0];

    // --- الإضافة الجديدة: توليد توكن فوراً بعد التسجيل ---
    const token = jwt.sign(
      { id: user.id, username: user.names, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // نرسل التوكن مع الرد لكي يتمكن React من التوجه للداشبورد
    res.status(201).json({ 
      message: "Registration successful!", 
      token, 
      username: user.names, 
      role: user.role 
    });

  } catch (err) {
    console.error("❌ REGISTER ERROR:", err.message);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Database Error: " + err.message });
  }
}

/**
 * 2. الدخول الموحد (Unified Login)
 */
async function login(req, res) {
  try {
    const { username, password } = req.body; 

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR names = $1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials (User not found)" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials (Wrong password)" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.names, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ 
      token, 
      username: user.names, 
      role: user.role 
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// --- إدارة اللوحات الفنية (Artworks) ---

async function getAdminArtworks(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM artworks ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createArtwork(req, res) {
  try {
    const { title, description, category, status, price, artist } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const { rows } = await pool.query(
      `INSERT INTO artworks (title, description, image_url, category, status, price, artist)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description || null, image_url, category || "Art", status || "Available", price || null, artist || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateArtwork(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, status, price, artist } = req.body;
    
    const existing = await pool.query("SELECT * FROM artworks WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Artwork not found" });

    const current = existing.rows[0];
    let image_url = current.image_url;

    if (req.file) {
      if (current.image_url) {
        const oldPath = path.join(__dirname, "..", current.image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const { rows } = await pool.query(
      `UPDATE artworks SET title=$1, description=$2, image_url=$3, category=$4, status=$5, price=$6, artist=$7 
       WHERE id=$8 RETURNING *`,
      [title || current.title, description !== undefined ? description : current.description, image_url, 
       category || current.category, status || current.status, price !== undefined ? price : current.price, 
       artist !== undefined ? artist : current.artist, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteArtwork(req, res) {
  try {
    const { id } = req.params;
    const existing = await pool.query("SELECT * FROM artworks WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Artwork not found" });

    const artwork = existing.rows[0];
    if (artwork.image_url) {
      const filePath = path.join(__dirname, "..", artwork.image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await pool.query("DELETE FROM artworks WHERE id = $1", [id]);
    res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAdminMessages(req, res) {
  try {
    const { rows } = await pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  getAdminArtworks,
  getAdminMessages,
  createArtwork,
  updateArtwork,
  deleteArtwork,
};
