const crypto = require("node:crypto");
const { insertNewsletterEvent, readJsonBody, supabaseFetch } = require("./_lib/newsletter.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = readJsonBody(req);
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) {
      return res.status(400).json({ error: "Missing token." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const lookup = await supabaseFetch(
      `/rest/v1/newsletter_subscribers?unsubscribe_token_hash=eq.${tokenHash}&select=id,email,status&limit=1`,
      { method: "GET" }
    );
    if (!lookup.ok) {
      return res.status(500).json({ error: "Could not verify token right now." });
    }

    const rows = await lookup.json();
    if (!Array.isArray(rows) || !rows.length) {
      return res.status(400).json({ error: "This unsubscribe link is invalid or expired." });
    }

    const row = rows[0];
    if (row.status === "unsubscribed") {
      return res.status(200).json({ ok: true, status: "already_unsubscribed" });
    }

    const update = await supabaseFetch(`/rest/v1/newsletter_subscribers?id=eq.${row.id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "unsubscribed",
        confirmation_token_hash: null,
        confirmation_token_expires_at: null,
      }),
    });
    if (!update.ok) {
      return res.status(500).json({ error: "Could not unsubscribe right now." });
    }

    await insertNewsletterEvent({
      subscriberId: row.id,
      email: row.email || null,
      eventType: "unsubscribe_clicked",
    });

    return res.status(200).json({ ok: true, status: "unsubscribed" });
  } catch (_error) {
    return res.status(500).json({ error: "Unexpected error while unsubscribing." });
  }
};
