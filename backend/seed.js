const bcrypt = require("bcryptjs");
const pool = require("./db");
require("dotenv").config();

async function seed() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
    [username, hash]
  );

  console.log(`Admin user "${username}" seeded successfully.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});