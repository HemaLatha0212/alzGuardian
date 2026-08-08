import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "alzguardian",
  user: process.env.DB_USER || "alzguardian",
  password: process.env.DB_PASSWORD || "alzguardian_dev_password",
});

export const testDatabaseConnection = async () => {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
};