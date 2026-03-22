module.exports = function handler(_req, res) {
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY || null;
  res.status(200).json({ turnstileSiteKey });
};
