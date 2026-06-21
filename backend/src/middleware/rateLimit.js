import rateLimit from "express-rate-limit";

export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many inquiries submitted. Please try again later." },
});

// Brute-force guard on the admin login. This is the main door attackers use
// to get write access to a CMS and inject spam content/links — far more
// important to limit than the contact form.
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many login attempts. Please try again later." },
});

// General write-rate guard for authenticated admin mutations (article/upload
// create-update-delete). Caps automated bulk content injection even if a
// token is ever compromised or leaked.
export const adminWriteRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down." },
});
