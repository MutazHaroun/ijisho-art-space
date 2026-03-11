const pool = require("../db");

// POST /api/contact
async function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, subject || null, message]
    );
    res.status(201).json({ message: "Message sent successfully", data: rows[0] });
  } catch (err) {
    console.error("submitContact error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/admin/messages  (protected – used in admin routes)
async function getMessages(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { submitContact, getMessages };
