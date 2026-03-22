module.exports = function handler(_req, res) {
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY || null;
  const envStatus = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
    RESEND_FROM_EMAIL: Boolean(process.env.RESEND_FROM_EMAIL),
    APP_BASE_URL: Boolean(process.env.APP_BASE_URL),
    TURNSTILE_SITE_KEY: Boolean(process.env.TURNSTILE_SITE_KEY),
    TURNSTILE_SECRET_KEY: Boolean(process.env.TURNSTILE_SECRET_KEY),
  };
  res.status(200).json({
    turnstileSiteKey,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    envStatus,
  });
};
