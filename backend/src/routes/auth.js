import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../lib/asyncHandler.js";
import { loginRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/login", loginRateLimit, asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || "");
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
}));

export default router;
