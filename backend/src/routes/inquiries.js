import express from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = express.Router();

const FIELDS = `
  id, name, company, email, website, message, status, created_at AS "createdAt"
`;

const VALID_STATUSES = new Set(["New", "Reviewed", "Archived"]);

router.get(
  "/admin/all",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const params = [];
    let where = "";

    if (status) {
      if (!VALID_STATUSES.has(status)) {
        return res.status(400).json({ error: "Invalid status filter" });
      }
      params.push(status);
      where = "WHERE status = $1";
    }

    const result = await pool.query(
      `SELECT ${FIELDS} FROM inquiries ${where} ORDER BY created_at DESC`,
      params
    );
    res.json({ inquiries: result.rows });
  })
);

router.get(
  "/admin/counts",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await pool.query(
      `SELECT status, COUNT(*) FROM inquiries GROUP BY status`
    );
    const counts = { New: 0, Reviewed: 0, Archived: 0 };
    for (const row of result.rows) {
      counts[row.status] = parseInt(row.count, 10);
    }
    res.json(counts);
  })
);

router.get(
  "/admin/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = await pool.query(`SELECT ${FIELDS} FROM inquiries WHERE id = $1`, [
      req.params.id,
    ]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  })
);

router.patch(
  "/admin/:id/status",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body || {};
    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING ${FIELDS}`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  })
);

router.delete(
  "/admin/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await pool.query("DELETE FROM inquiries WHERE id = $1", [req.params.id]);
    res.status(204).end();
  })
);

export default router;
