import express from "express";
import validator from "validator";
import { pool } from "../db/pool.js";
import { contactRateLimit } from "../middleware/rateLimit.js";
import { sendInquiryNotification } from "../lib/mailer.js";

const router = express.Router();

const MAX_NAME = 200;
const MAX_COMPANY = 200;
const MAX_EMAIL = 254;
const MAX_WEBSITE = 500;
const MAX_MESSAGE = 5000;

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

function clean(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

router.post("/", contactRateLimit, async (req, res) => {
  const body = req.body || {};

  // Honeypot: a hidden field real visitors never fill in. Bots that
  // blindly fill every input will trip it.
  if (typeof body.website2 === "string" && body.website2.trim() !== "") {
    return res.status(201).json({ ok: true });
  }

  const name = clean(body.name, MAX_NAME);
  const company = clean(body.company, MAX_COMPANY);
  const email = clean(body.email, MAX_EMAIL);
  const website = clean(body.website, MAX_WEBSITE);
  const message = clean(body.message, MAX_MESSAGE);

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (website && !/^https?:\/\//i.test(website)) {
    return res.status(400).json({ error: "Website must be a valid URL." });
  }

  let inquiry;
  try {
    const result = await pool.query(
      `INSERT INTO inquiries (name, company, email, website, message, status)
       VALUES ($1,$2,$3,$4,$5,'New')
       RETURNING id, name, company, email, website, message, status, created_at AS "createdAt"`,
      [name, company || null, email, website || null, message]
    );
    inquiry = result.rows[0];
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }

  res.status(201).json({ ok: true });

  try {
    await sendInquiryNotification(inquiry);
  } catch (err) {
    console.error("Failed to send inquiry notification email:", err);
  }
});

export default router;
