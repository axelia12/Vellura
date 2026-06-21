import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";
import { adminWriteRateLimit } from "../middleware/rateLimit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "../../uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// File extension and the client-supplied mimetype are both just labels the
// uploader chose — neither proves what the bytes actually are. A renamed
// HTML/SVG/script file with a ".jpg" extension would otherwise sail through
// and get served back out from /uploads. Checking the real magic bytes closes
// that hole; this is what stops a disguised file from being used to host
// injected content under this domain.
function detectImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const brand = buffer.toString("ascii", 8, 12);
    if (brand.startsWith("avif") || brand.startsWith("avis")) return "avif";
  }
  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) return cb(new Error("Unsupported file type"));
    cb(null, true);
  },
});

const router = express.Router();

router.post("/", requireAuth, adminWriteRateLimit, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const detected = detectImageType(req.file.buffer);
  if (!detected) {
    return res.status(400).json({ error: "File content does not match a supported image type" });
  }

  const filename = `${crypto.randomUUID()}.${detected === "jpg" ? "jpg" : detected}`;
  fs.writeFileSync(path.join(uploadsDir, filename), req.file.buffer);

  res.status(201).json({ url: `/uploads/${filename}` });
});

export default router;
