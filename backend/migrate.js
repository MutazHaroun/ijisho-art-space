const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runMigration() {
  const connectionString =
    process.env.DATABASE_URL ||
    null;

  const client = connectionString
    ? new Client({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      })
    : new Client({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
          rejectUnauthorized: false,
        },
      });

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, "db", "migration.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await client.query(sql);
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();