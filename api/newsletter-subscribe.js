const {
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
} = require("./_lib/newsletter.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = readJsonBody(req);
    const email = normalizeEmail(body.email);
    const consent = Boolean(body.consent);
    const sourcePath = typeof body.sourcePath === "string" ? body.sourcePath.slice(0, 160) : "/";
    const sourceLocale = typeof body.locale === "string" ? body.locale.slice(0, 32) : "en";
    const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!consent) {
      return res.status(400).json({ error: "Please confirm consent before continuing." });
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, getClientIp(req));
    if (!turnstile.success) {
      return res.status(400).json({ error: "Captcha verification failed. Please try again." });
    }

    const lookup = await supabaseFetch(
      `/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}&select=id,status&limit=1`,
      { method: "GET" }
    );
    if (!lookup.ok) {
      return res.status(500).json({ error: "Could not save your request right now." });
    }

    const existingRows = await lookup.json();
    const existing = Array.isArray(existingRows) && existingRows.length ? existingRows[0] : null;
    if (existing && isAllowedStatus(existing.status) && existing.status === "confirmed") {
      return res.status(200).json({ ok: true, status: "already_confirmed" });
    }

    const { token, tokenHash } = createConfirmationToken();
    const expiresAt = addHours(new Date(), 48).toISOString();
    const now = new Date().toISOString();

    if (existing && existing.id) {
      const update = await supabaseFetch(`/rest/v1/newsletter_subscribers?id=eq.${existing.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: "pending",
          consent_launch_updates: true,
          consent_text_version: "v1_launch_only_2026_03_22",
          consent_text: "I agree to receive launch updates by email from CannaClear.",
          consent_at: now,
          confirmation_token_hash: tokenHash,
          confirmation_token_expires_at: expiresAt,
          source_path: sourcePath,
          source_locale: sourceLocale,
          confirmed_at: null,
        }),
      });
      if (!update.ok) {
        return res.status(500).json({ error: "Could not save your request right now." });
      }
    } else {
      const insert = await supabaseFetch("/rest/v1/newsletter_subscribers", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify([
          {
            email,
            status: "pending",
            consent_launch_updates: true,
            consent_text_version: "v1_launch_only_2026_03_22",
            consent_text: "I agree to receive launch updates by email from CannaClear.",
            consent_at: now,
            confirmation_token_hash: tokenHash,
            confirmation_token_expires_at: expiresAt,
            source_path: sourcePath,
            source_locale: sourceLocale,
          },
        ]),
      });
      if (!insert.ok) {
        return res.status(500).json({ error: "Could not save your request right now." });
      }
    }

    const appBaseUrl = getEnv("APP_BASE_URL", false) || "https://www.cannaclear.app";
    const confirmUrl = `${appBaseUrl.replace(/\/$/, "")}/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const mailSent = await sendConfirmationEmail({ email, confirmUrl });
    if (!mailSent) {
      return res.status(500).json({ error: "Could not send confirmation email right now." });
    }

    return res.status(200).json({ ok: true, status: "pending_confirmation" });
  } catch (error) {
    if (String(error && error.message || "").includes("Missing environment variable")) {
      return res.status(500).json({ error: "Server configuration is incomplete." });
    }
    return res.status(500).json({ error: "Unexpected error while subscribing." });
  }
};
