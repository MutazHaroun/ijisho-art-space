const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

/**
 * 1) Register
 * أي مستخدم جديد يتم إنشاؤه كـ user فقط
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await pool.query(
      `INSERT INTO users (id, names, email, password, role)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4)
       RETURNING id, names, email, role`,
      [name, email, hashedPassword, "user"]
    );

    const user = rows[0];

    const token = jwt.sign(
      { id: user.id, username: user.names, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    return res.status(201).json({
      message: "Registration successful!",
      token,
      username: user.names,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err.message);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already registered" });
    }

    return res.status(500).json({ error: "Database Error: " + err.message });
  }
}

/**
 * 2) Login
 * تسجيل دخول موحد لأي مستخدم
 * والواجهة تقرر الوجهة حسب role
 */

async function login(req, res) {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, username, password } = req.body;
    const loginValue = email || username;

    if (!loginValue || !password) {
      return res.status(400).json({
        error: "Email/username and password are required",
      });
    }

    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR name = $1",
      [loginValue]
    );

    console.log("LOGIN USER ROWS:", rows);

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials (User not found)",
      });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid credentials (Wrong password)",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    });

    return res.json({
  message: "Login successful",
  token,
  id: user.id,
  username: user.name,
  email: user.email,
  role: user.role,
});
  } catch (err) {
    console.error("❌ LOGIN ERROR FULL:", err);
    console.error("❌ LOGIN ERROR MESSAGE:", err.message);
    console.error("❌ LOGIN ERROR STACK:", err.stack);
    return res.status(500).json({ error: "Internal server error" });
  }
}


/**
 * 3) Get all artworks for admin dashboard
 */
async function getAdminArtworks(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM artworks ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ GET ADMIN ARTWORKS ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 4) Create artwork
 */
async function createArtwork(req, res) {
  try {
    const { title, description, category, status, price, artist } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO artworks (title, description, image_url, category, status, price, artist)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        title,
        description || null,
        image_url,
        category || "Art",
        status || "Available",
        price || null,
        artist || null,
      ]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("❌ CREATE ARTWORK ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 5) Update artwork
 */
async function updateArtwork(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, status, price, artist } = req.body;

    const existing = await pool.query(
      "SELECT * FROM artworks WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    const current = existing.rows[0];
    let image_url = current.image_url;

    if (req.file) {
      if (current.image_url) {
        const oldPath = path.join(__dirname, "..", current.image_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      image_url = `/uploads/${req.file.filename}`;
    }

    const { rows } = await pool.query(
      `UPDATE artworks
       SET title = $1,
           description = $2,
           image_url = $3,
           category = $4,
           status = $5,
           price = $6,
           artist = $7
       WHERE id = $8
       RETURNING *`,
      [
        title || current.title,
        description !== undefined ? description : current.description,
        image_url,
        category || current.category,
        status || current.status,
        price !== undefined ? price : current.price,
        artist !== undefined ? artist : current.artist,
        id,
      ]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ UPDATE ARTWORK ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 6) Delete artwork
 */
async function deleteArtwork(req, res) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      "SELECT * FROM artworks WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    const artwork = existing.rows[0];

    if (artwork.image_url) {
      const filePath = path.join(__dirname, "..", artwork.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query("DELETE FROM artworks WHERE id = $1", [id]);

    return res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE ARTWORK ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 7) Get all contact messages for admin dashboard
 */
async function getAdminMessages(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    return res.json(rows);
  } catch (err) {
    console.error("❌ GET ADMIN MESSAGES ERROR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 8) Delete contact message
 */
async function deleteMessage(req, res) {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      "SELECT * FROM contact_messages WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    await pool.query("DELETE FROM contact_messages WHERE id = $1", [id]);

    return res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE MESSAGE ERROR:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * 9) Get admin profile
 */
async function getAdminProfile(req, res) {
  try {
    const adminId = req.user.id;

    const { rows } = await pool.query(
      `SELECT id, name, email, role
       FROM users
       WHERE id = $1`,
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("❌ GET ADMIN PROFILE ERROR:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * 10) Update admin profile
 */
async function updateAdminProfile(req, res) {
  try {
    const adminId = req.user.id;
    const { name, password } = req.body;

    const existing = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [adminId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const current = existing.rows[0];

    let updatedPassword = current.password;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    const { rows } = await pool.query(
      `UPDATE users
       SET name = $1,
           password = $2
       WHERE id = $3
       RETURNING id, name, email, role`,
      [name || current.name, updatedPassword, adminId]
    );

    return res.json({
      message: "Profile updated successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error("❌ UPDATE ADMIN PROFILE ERROR:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * 11) Logout (clear the cookie)
 */
function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.json({ message: "Logged out successfully" });
}

/**
 * 12) Get all reviews (ADMIN)
 */
async function getAllReviews(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id,
        r.artwork_id,
        r.customer_name,
        r.customer_phone,
        r.rating,
        r.comment,
        r.created_at,
        a.title AS artwork_title
      FROM artwork_reviews r
      LEFT JOIN artworks a 
      ON r.artwork_id::text = a.id::text
      ORDER BY r.created_at DESC
    `);

    return res.json(rows);
  } catch (err) {
    console.error("🔥 REAL ERROR:", err); // مهم
    return res.status(500).json({ error: err.message });
  }
}

/**
 * 13) Delete review (ADMIN)
 */
async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM artwork_reviews WHERE id = $1", [id]);

    return res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE REVIEW ERROR:", err.message);
    return res.status(500).json({ error: "Failed to delete review" });
  }
}

module.exports = {
  register,
  login,
  logout,
  getAdminArtworks,
  getAdminMessages,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  deleteMessage,
  getAdminProfile,
  updateAdminProfile,
  getAllReviews,
  deleteReview,
};

