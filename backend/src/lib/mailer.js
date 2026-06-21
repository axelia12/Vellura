import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return transporter;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendInquiryNotification(inquiry) {
  const transport = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!transport || !adminEmail) {
    console.warn("Mailer not configured; skipping inquiry notification email.");
    return;
  }

  const { name, company, email, website, message } = inquiry;

  const text = `Name: ${name}
Company: ${company || "—"}
Email: ${email}
Website: ${website || "—"}

Message:
${message}`;

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company || "—")}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Website:</strong> ${escapeHtml(website || "—")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: "New VELLURA Inquiry",
    text,
    html,
  });
}
