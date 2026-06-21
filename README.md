# Vellura

A premium strategic communications website. Frontend in Next.js 15 (TypeScript, Tailwind, Framer Motion); backend in Express + PostgreSQL; a password-protected admin panel for managing the Journal and incoming inquiries.

## Structure

```
vellura/
├── backend/    Express API + PostgreSQL (articles, auth, contact/inquiries, uploads)
└── frontend/   Next.js 15 app (Home, Journal, Contact, /admin)
```

## Backend setup

1. Provision a PostgreSQL database (locally or via Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16`).
2. `cd backend && npm install`
3. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Postgres connection string
   - `JWT_SECRET` — a long random string
   - `ADMIN_EMAIL` — the admin login email, and the address inquiry notifications are sent to
   - `ADMIN_PASSWORD_HASH` — generate with `node src/scripts/hash-password.js <your-password>`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` — for inquiry notification emails (Nodemailer). If left blank, inquiries still save to the database and show up in the admin panel — only the email notification is skipped.
4. Run the migration: `npm run migrate`
5. Start the API: `npm run dev` (listens on port 4000 by default)

## Frontend setup

1. `cd frontend && npm install`
2. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`) and `NEXT_PUBLIC_SITE_URL`.
3. `npm run dev` — site runs on `http://localhost:3000`
4. Visit `/admin` to log in with the email/password you hashed above.

## Production build

```
cd frontend && npm run build && npm start
cd backend && npm start
```

The frontend's `sitemap.xml` and homepage/journal pages fetch from the backend at build/request time — ensure the API is reachable wherever you build or deploy.

## Notes

- Pages are intentionally limited to Home, Journal, and Contact — no Services/About/Team pages, by design.
- Uploaded images are stored on disk under `backend/uploads` and served at `/uploads/*`. For production, point this at object storage (S3, R2, etc.) instead of local disk.
- `/admin` is excluded from the sitemap and disallowed in `robots.txt`.
- Contact submissions are validated and sanitized server-side, rate-limited (5 per 15 minutes per IP), and protected by a hidden honeypot field. Every inquiry is stored in `inquiries` with a `New`/`Reviewed`/`Archived` status, manageable from `/admin/inquiries`, and triggers an email notification to `ADMIN_EMAIL` if SMTP is configured.

## Security hardening

These guard specifically against the most common way a small CMS-backed site gets used to host injected spam/keyword content (the "Japanese keyword hack" pattern — not WordPress-specific, the same mechanics apply to any admin-editable site):

- **Admin login is rate-limited** (`backend/src/middleware/rateLimit.js`): 10 attempts per 15 minutes per IP, successful logins don't count against the limit. This is the actual door attackers use to get write access.
- **Article content is sanitized server-side** (`backend/src/lib/sanitize.js`) before it's ever stored — `<script>` tags, `javascript:` URIs, and inline event handlers (`onerror`, etc.) are stripped from rich-text content; plain-text fields (titles, excerpts, SEO metadata) have all markup stripped. This closes the stored-XSS path that gets used to inject hidden spam links/keywords into indexed pages.
- **Uploaded images are verified by magic bytes**, not just file extension or client-supplied MIME type (`backend/src/routes/upload.js`) — a renamed HTML/script file disguised as `.jpg` is rejected before it ever touches disk.
- **Helmet security headers** are applied globally (CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, etc.).
- **Admin write endpoints are rate-limited** (60 requests / 5 minutes) as a backstop against bulk automated content injection even if a token is ever compromised.
