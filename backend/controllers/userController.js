const pool = require("../db");
const bcrypt = require("bcryptjs"); // يفضل استخدامه مباشرة لضمان العمل

// POST /api/users/register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body; // استقبل الباسورد الحقيقي أو استخدم الافتراضي
    const defaultPass = password || "123456";

    // 1. التشفير باستخدام bcrypt مباشرة لضمان عدم وجود أخطاء في الـ utils
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPass, salt);

    // 2. التحقق من وجود المستخدم مسبقاً
    const checkQuery = "SELECT id FROM users WHERE email = $1";
    const checkResult = await pool.query(checkQuery, [email]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 3. الإدخال في قاعدة البيانات
    // ملاحظة: الـ id يجب أن يولد تلقائياً في قاعدة البيانات
    const sql = `INSERT INTO users (names, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(sql, [name, email, hashedPassword, 'user']);
    
    console.log("User created successfully:", result.rows[0]);
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: { id: result.rows[0].id, name: result.rows[0].names } 
    });

  } catch (err) {
    console.error('Registration error details:', err.message);
    res.status(500).json({ error: "Database error: " + err.message });
  }
};

module.exports = registerController;