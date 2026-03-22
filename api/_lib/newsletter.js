const crypto = require("node:crypto");

const ALLOWED_SUBSCRIBER_STATUSES = new Set(["pending", "confirmed", "unsubscribed"]);

function getEnv(name, required = true) {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value || "";
}

function readJsonBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (_err) {
      return {};
    }
  }
  return req.body;
}

function normalizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createConfirmationToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

function addHours(date, hours) {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next;
}

function isAllowedStatus(status) {
  return ALLOWED_SUBSCRIBER_STATUSES.has(status);
}

async function verifyTurnstileToken(token, ipAddress) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: true, skipped: true };
  if (!token) return { success: false, skipped: false };

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ipAddress) {
    body.set("remoteip", ipAddress);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) return { success: false, skipped: false };
  const result = await response.json();
  return { success: Boolean(result.success), skipped: false };
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return "";
}

async function supabaseFetch(path, options = {}) {
  const supabaseUrl = getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const url = `${supabaseUrl.replace(/\/$/, "")}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {}),
    },
  });

  return response;
}

async function sendConfirmationEmail({
  email,
  confirmUrl,
}) {
  const resendApiKey = getEnv("RESEND_API_KEY");
  const fromEmail = getEnv("RESEND_FROM_EMAIL");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [email],
      subject: "Confirm your CannaClear early access",
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f2330;">
          <h2 style="margin:0 0 12px;">Confirm your early access</h2>
          <p style="margin:0 0 14px;">Thanks for joining the CannaClear launch list.</p>
          <p style="margin:0 0 18px;">Please confirm your email to receive launch updates:</p>
          <p style="margin:0 0 20px;">
            <a href="${confirmUrl}" style="display:inline-block;background:#1198a7;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:700;">
              Confirm my email
            </a>
          </p>
          <p style="margin:0 0 8px;color:#4d6372;">This link expires in 48 hours.</p>
          <p style="margin:0;color:#4d6372;">You can ignore this email if you did not request it.</p>
        </div>
      `,
      text: `Confirm your CannaClear early access: ${confirmUrl}\n\nThis link expires in 48 hours.`,
    }),
  });

  return response.ok;
}

module.exports = {
  addHours,
  createConfirmationToken,
  getClientIp,
  getEnv,
  isAllowedStatus,
  isValidEmail,
  normalizeEmail,
  readJsonBody,
  sendConfirmationEmail,
  supabaseFetch,
  verifyTurnstileToken,
};
