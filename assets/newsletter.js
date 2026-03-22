const NEWSLETTER_ENDPOINT = "/api/newsletter-subscribe";
const NEWSLETTER_CONFIRM_ENDPOINT = "/api/newsletter-confirm";
const NEWSLETTER_CONFIG_ENDPOINT = "/api/newsletter-config";

function normalizePath(path) {
  if (!path || typeof path !== "string") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function setFormState(form, message, type) {
  const feedback = form.querySelector("[data-newsletter-feedback]");
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.remove("is-success", "is-error", "is-info");
  feedback.classList.add(type === "error" ? "is-error" : type === "success" ? "is-success" : "is-info");
}

function lockForm(form, locked) {
  const fields = form.querySelectorAll("input, button, textarea, select");
  fields.forEach((field) => {
    if (field.type !== "hidden") {
      field.disabled = locked;
    }
  });
}

function getTurnstileToken(form) {
  const field = form.querySelector('input[name="cf-turnstile-response"]');
  return field && field.value ? field.value.trim() : "";
}

async function fetchNewsletterConfig() {
  try {
    const res = await fetch(NEWSLETTER_CONFIG_ENDPOINT, { method: "GET" });
    if (!res.ok) return { turnstileSiteKey: null };
    return await res.json();
  } catch (_err) {
    return { turnstileSiteKey: null };
  }
}

function loadTurnstileScript() {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[data-turnstile-script="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.turnstileScript = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });
}

function renderTurnstileWidget(form, siteKey) {
  const target = form.querySelector("[data-turnstile-container]");
  if (!target || !window.turnstile || target.dataset.rendered === "true") return;
  window.turnstile.render(target, { sitekey: siteKey });
  target.dataset.rendered = "true";
}

async function enhanceNewsletterForms() {
  const forms = document.querySelectorAll("[data-newsletter-form]");
  if (!forms.length) return;

  const config = await fetchNewsletterConfig();
  if (config.turnstileSiteKey) {
    try {
      await loadTurnstileScript();
      forms.forEach((form) => renderTurnstileWidget(form, config.turnstileSiteKey));
    } catch (_err) {
      forms.forEach((form) => {
        setFormState(form, "Captcha failed to load. You can still try again in a moment.", "error");
      });
    }
  }

  forms.forEach((form) => {
    const sourceInput = form.querySelector('input[name="sourcePath"]');
    if (sourceInput) {
      sourceInput.value = normalizePath(window.location.pathname);
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const emailInput = form.querySelector('input[name="email"]');
      const consentInput = form.querySelector('input[name="consent"]');
      if (!emailInput || !consentInput) return;

      const payload = {
        email: emailInput.value.trim(),
        consent: Boolean(consentInput.checked),
        sourcePath: normalizePath(window.location.pathname),
        locale: navigator.language || "en",
        turnstileToken: getTurnstileToken(form),
      };

      lockForm(form, true);
      setFormState(form, "Saving your request...", "info");

      try {
        const response = await fetch(NEWSLETTER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong. Please try again.");
        }

        if (data.status === "already_confirmed") {
          setFormState(form, "You're already on the list. We'll email you at launch.", "success");
        } else {
          setFormState(
            form,
            "You're in. Check your inbox and confirm your email to complete early access.",
            "success"
          );
        }
        form.reset();
        const hiddenSource = form.querySelector('input[name="sourcePath"]');
        if (hiddenSource) {
          hiddenSource.value = normalizePath(window.location.pathname);
        }
      } catch (err) {
        setFormState(form, err.message || "Could not subscribe right now. Please try again.", "error");
      } finally {
        lockForm(form, false);
      }
    });
  });
}

async function runConfirmFlow() {
  const statusEl = document.querySelector("[data-newsletter-confirm-status]");
  if (!statusEl) return;

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (!token) {
    statusEl.textContent = "Invalid confirmation link.";
    statusEl.classList.add("is-error");
    return;
  }

  statusEl.textContent = "Confirming your email...";
  statusEl.classList.add("is-info");

  try {
    const response = await fetch(NEWSLETTER_CONFIRM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json().catch(() => ({}));

    statusEl.classList.remove("is-info", "is-error", "is-success");
    if (!response.ok) {
      statusEl.textContent = data.error || "Confirmation failed. Please request a new link.";
      statusEl.classList.add("is-error");
      return;
    }

    if (data.status === "already_confirmed") {
      statusEl.textContent = "Your email is already confirmed. You're on the early access list.";
      statusEl.classList.add("is-success");
      return;
    }

    statusEl.textContent = "Email confirmed. You're on the CannaClear early access list.";
    statusEl.classList.add("is-success");
  } catch (_err) {
    statusEl.classList.remove("is-info");
    statusEl.classList.add("is-error");
    statusEl.textContent = "Network issue while confirming. Please try again.";
  }
}

enhanceNewsletterForms();
runConfirmFlow();
