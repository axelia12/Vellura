import express from "express";
import slugify from "slugify";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { adminWriteRateLimit } from "../middleware/rateLimit.js";
import { sanitizeArticleContent, stripHtml } from "../lib/sanitize.js";

const router = express.Router();

const PUBLIC_FIELDS = `
  id, title, slug, excerpt, content, category, featured_image AS "featuredImage",
  seo_title AS "seoTitle", seo_description AS "seoDescription",
  status, published_at AS "publishedAt", created_at AS "createdAt", updated_at AS "updatedAt"
`;

// ---------- Public ----------

router.get("/", asyncHandler(async (req, res) => {
  const { category, search, page = "1", pageSize = "9" } = req.query;
  const limit = Math.min(parseInt(pageSize, 10) || 9, 50);
  const offset = (Math.max(parseInt(page, 10) || 1, 1) - 1) * limit;

  const conditions = ["status = 'published'"];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
  }

  const where = conditions.join(" AND ");

  const countResult = await pool.query(`SELECT COUNT(*) FROM articles WHERE ${where}`, params);
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);
  const result = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM articles WHERE ${where}
     ORDER BY published_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  res.json({ articles: result.rows, total, page: Number(page), pageSize: limit });
}));

// ---------- Admin ----------
// Registered before the public "/:slug" catch-all so "/admin/*" isn't swallowed by it.

router.get("/admin/all", requireAuth, asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM articles ORDER BY updated_at DESC`
  );
  res.json({ articles: result.rows });
}));

router.get("/admin/:id", requireAuth, asyncHandler(async (req, res) => {
  const result = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM articles WHERE id = $1`, [
    req.params.id,
  ]);
  if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
}));

router.post("/admin", requireAuth, adminWriteRateLimit, asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    category,
    featuredImage,
    seoTitle,
    seoDescription,
    status = "draft",
    slug: customSlug,
  } = req.body || {};

  if (!title || !content || !category) {
    return res.status(400).json({ error: "title, content and category are required" });
  }

  const slug = customSlug ? slugify(customSlug, { lower: true }) : slugify(title, { lower: true });
  const publishedAt = status === "published" ? new Date() : null;
  const safeContent = sanitizeArticleContent(content);
  const safeTitle = stripHtml(title);
  const safeExcerpt = stripHtml(excerpt);
  const safeSeoTitle = stripHtml(seoTitle);
  const safeSeoDescription = stripHtml(seoDescription);

  try {
    const result = await pool.query(
      `INSERT INTO articles
        (title, slug, excerpt, content, category, featured_image, seo_title, seo_description, status, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING ${PUBLIC_FIELDS}`,
      [safeTitle, slug, safeExcerpt, safeContent, category, featuredImage, safeSeoTitle, safeSeoDescription, status, publishedAt]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "An article with this slug already exists" });
    }
    throw err;
  }
}));

router.put("/admin/:id", requireAuth, adminWriteRateLimit, asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    category,
    featuredImage,
    seoTitle,
    seoDescription,
    status,
    slug: customSlug,
  } = req.body || {};

  const existing = await pool.query("SELECT status, published_at FROM articles WHERE id = $1", [
    req.params.id,
  ]);
  if (existing.rows.length === 0) return res.status(404).json({ error: "Not found" });

  const wasPublished = existing.rows[0].status === "published";
  const publishedAt =
    status === "published" && !wasPublished ? new Date() : existing.rows[0].published_at;

  const slug = customSlug ? slugify(customSlug, { lower: true }) : undefined;
  const safeContent = sanitizeArticleContent(content);
  const safeTitle = stripHtml(title);
  const safeExcerpt = stripHtml(excerpt);
  const safeSeoTitle = stripHtml(seoTitle);
  const safeSeoDescription = stripHtml(seoDescription);

  try {
    const result = await pool.query(
      `UPDATE articles SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        excerpt = COALESCE($3, excerpt),
        content = COALESCE($4, content),
        category = COALESCE($5, category),
        featured_image = COALESCE($6, featured_image),
        seo_title = COALESCE($7, seo_title),
        seo_description = COALESCE($8, seo_description),
        status = COALESCE($9, status),
        published_at = $10,
        updated_at = now()
       WHERE id = $11
       RETURNING ${PUBLIC_FIELDS}`,
      [safeTitle, slug, safeExcerpt, safeContent, category, featuredImage, safeSeoTitle, safeSeoDescription, status, publishedAt, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "An article with this slug already exists" });
    }
    throw err;
  }
}));

router.delete("/admin/:id", requireAuth, adminWriteRateLimit, asyncHandler(async (req, res) => {
  await pool.query("DELETE FROM articles WHERE id = $1", [req.params.id]);
  res.status(204).end();
}));

// Public single-article lookup must be last: it's a catch-all for any remaining "/:slug".
router.get("/:slug", asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM articles WHERE slug = $1 AND status = 'published'`,
    [req.params.slug]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
}));

export default router;
