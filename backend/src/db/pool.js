import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Idle clients in the pool emit "error" outside of any request's call stack.
// Without a listener, Node treats that as an uncaught exception and crashes
// the whole process — so every route's try/catch becomes irrelevant.
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});
