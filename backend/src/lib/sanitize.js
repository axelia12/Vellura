import sanitizeHtml from "sanitize-html";

// Matches what the admin's Tiptap editor (RichTextEditor.tsx) can actually
// produce. Anything outside this allowlist — <script>, event handlers,
// javascript: URIs, hidden spam links, etc. — is the exact mechanism behind
// CMS keyword-injection attacks (a compromised or careless editor session
// stores malicious markup that gets rendered, and indexed, on public pages).
const ARTICLE_CONTENT_OPTIONS = {
  allowedTags: [
    "p", "br", "strong", "em", "u", "s",
    "h2", "h3", "blockquote",
    "ul", "ol", "li",
    "a", "img",
  ],
  allowedAttributes: {
    a: ["href", "rel", "target"],
    img: ["src", "alt"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitizeArticleContent(html) {
  if (typeof html !== "string") return html;
  return sanitizeHtml(html, ARTICLE_CONTENT_OPTIONS);
}

// Plain-text fields (titles, excerpts, SEO metadata) should never contain
// markup at all — strip everything.
export function stripHtml(value) {
  if (typeof value !== "string") return value;
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}
