(function () {
  const ARTICLE_EXCLUDE_PATHS = new Set([
    "/",
    "/about",
    "/editorial-policy",
    "/medical-disclaimer",
    "/support",
    "/privacy",
    "/terms",
    "/legal-notice",
    "/download",
    "/newsletter/confirm",
    "/newsletter/unsubscribe"
  ]);

  const REFERENCES = [
    {
      title: "National Institute on Drug Abuse. Cannabis (Marijuana) DrugFacts.",
      href: "https://nida.nih.gov/publications/drugfacts/cannabis-marijuana",
      label: "NIDA"
    },
    {
      title: "Centers for Disease Control and Prevention. Cannabis and Public Health.",
      href: "https://www.cdc.gov/cannabis/",
      label: "CDC"
    },
    {
      title: "Substance Abuse and Mental Health Services Administration. National Helpline.",
      href: "https://www.samhsa.gov/find-help/national-helpline",
      label: "SAMHSA"
    },
    {
      title: "World Health Organization. ICD-11: Disorders due to use of cannabis.",
      href: "https://icd.who.int/browse11/l-m/en#/http://id.who.int/icd/entity/720107308",
      label: "WHO"
    },
    {
      title: "Bahji A, Stephenson C, Tyo R, Hawken ER, Seitz DP. Prevalence of Cannabis Withdrawal Symptoms Among People With Regular or Dependent Use of Cannabinoids: A Systematic Review and Meta-analysis.",
      href: "https://doi.org/10.1001/jamanetworkopen.2020.2370",
      label: "DOI"
    },
    {
      title: "Volkow ND, Baler RD, Compton WM, Weiss SRB. Adverse Health Effects of Marijuana Use.",
      href: "https://doi.org/10.1056/NEJMra1402309",
      label: "DOI"
    }
  ];

  function normalizePath(pathname) {
    if (!pathname || pathname === "/") return "/";
    return pathname.replace(/\/+$/, "");
  }

  function createSchemaScript(id, payload) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(payload);
    return script;
  }

  function injectOrganizationSchema() {
    if (document.getElementById("eeat-organization-schema")) return;

    document.head.appendChild(
      createSchemaScript("eeat-organization-schema", {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CannaClear",
        url: "https://www.cannaclear.app",
        logo: "https://www.cannaclear.app/assets/cannaclear-app-icon.webp"
      })
    );
  }

  function isArticlePage() {
    const path = normalizePath(window.location.pathname);
    if (ARTICLE_EXCLUDE_PATHS.has(path)) return false;
    return Boolean(document.querySelector("main.seo-card h1"));
  }

  function getArticleMain() {
    return document.querySelector("main.seo-card");
  }

  function estimateReadingTime(main) {
    const clone = main.cloneNode(true);
    clone.querySelectorAll(".article-meta, .trust-section, .author-card, .app-promo-banner, .related-links, script").forEach((node) =>
      node.remove()
    );
    const text = clone.textContent.replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").length : 0;
    return Math.max(1, Math.round(words / 225));
  }

  function formatLastUpdated() {
    const value = document.lastModified;
    const parsed = value ? new Date(value) : null;
    const safeDate = parsed && !Number.isNaN(parsed.valueOf()) ? parsed : new Date();
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(safeDate);
  }

  function injectArticleMeta(main) {
    if (main.querySelector(".article-meta")) return;

    const brand = main.querySelector(".content-brand");
    if (!brand) return;

    const meta = document.createElement("section");
    meta.className = "article-meta trust-card";

    const readingTime = estimateReadingTime(main);
    const lastUpdated = formatLastUpdated();

    meta.innerHTML = `
      <div class="article-meta__identity">
        <p class="article-meta__byline">By Lukas Pietruschka</p>
        <p class="article-meta__role">Founder of CannaClear</p>
      </div>
      <div class="article-meta__grid">
        <div class="article-meta__item">
          <span class="article-meta__label">Last Updated</span>
          <span class="article-meta__value">${lastUpdated}</span>
        </div>
        <div class="article-meta__item">
          <span class="article-meta__label">Reading Time</span>
          <span class="article-meta__value">${readingTime} min read</span>
        </div>
        <div class="article-meta__item article-meta__item--wide">
          <span class="article-meta__label">Evidence Level</span>
          <span class="article-meta__value">Research-based educational content</span>
        </div>
      </div>
    `;

    brand.insertAdjacentElement("afterend", meta);
  }

  function createMethodologySection() {
    const section = document.createElement("section");
    section.className = "section trust-section";
    section.dataset.trustSection = "methodology";
    section.innerHTML = `
      <div class="trust-card">
        <p class="eyebrow">Research Methodology</p>
        <h2>How we create our content</h2>
        <p>Every article published on CannaClear is based on current scientific literature, clinical guidelines, and evidence-based recovery principles.</p>
        <p>We review peer-reviewed research, public health recommendations, and real-world recovery experiences to create content that is accurate, practical, and easy to understand.</p>
        <p>Our goal is to translate complex science into actionable advice for people recovering from cannabis dependence.</p>
        <p>Articles are reviewed and updated regularly to reflect the latest available evidence.</p>
        <p><a href="/editorial-policy">Learn more about our Editorial Policy -&gt;</a></p>
      </div>
    `;
    return section;
  }

  function createReferencesSection() {
    const section = document.createElement("section");
    section.className = "section trust-section";
    section.dataset.trustSection = "references";

    const items = REFERENCES.map(
      (ref) => `
        <li>
          <span>${ref.title}</span>
          <a href="${ref.href}" target="_blank" rel="noopener">${ref.label}</a>
        </li>
      `
    ).join("");

    section.innerHTML = `
      <div class="trust-card">
        <p class="eyebrow">References</p>
        <h2>Scientific References</h2>
        <ul class="trust-reference-list">
          ${items}
        </ul>
      </div>
    `;
    return section;
  }

  function createDisclaimerSection() {
    const section = document.createElement("section");
    section.className = "section trust-section";
    section.dataset.trustSection = "disclaimer";
    section.innerHTML = `
      <div class="trust-card trust-card--soft">
        <p class="eyebrow">Medical Disclaimer</p>
        <h2>Medical Disclaimer</h2>
        <p>The information on CannaClear is provided for educational purposes only and should not replace professional medical advice, diagnosis, or treatment.</p>
        <p>If you experience severe withdrawal symptoms, depression, suicidal thoughts, or any medical emergency, seek immediate help from a qualified healthcare professional.</p>
        <p><a href="/medical-disclaimer">Read the full Medical Disclaimer -&gt;</a></p>
      </div>
    `;
    return section;
  }

  function createAuthorCard() {
    const section = document.createElement("section");
    section.className = "section trust-section";
    section.dataset.trustSection = "author";
    section.innerHTML = `
      <div class="trust-card author-card">
        <div class="author-card__avatar" aria-hidden="true">LP</div>
        <div class="author-card__body">
          <p class="eyebrow">About the Author</p>
          <h2>Lukas Pietruschka</h2>
          <p class="author-card__title">Founder of CannaClear • Recovery Researcher • Product Builder</p>
          <p>Lukas Pietruschka is the founder of CannaClear, a recovery platform that helps people quit cannabis and stay motivated throughout withdrawal and long-term recovery.</p>
          <p>He researches cannabis withdrawal, dopamine recovery, habit formation, behavioral psychology, and long-term recovery by reviewing scientific literature, clinical guidelines, and thousands of real recovery experiences shared by the community.</p>
          <p>His goal is to translate complex scientific research into practical, evidence-based guidance that anyone can understand.</p>
          <div class="author-card__links">
            <a href="/about">About Lukas &amp; CannaClear</a>
            <a href="/editorial-policy">Editorial Policy</a>
          </div>
        </div>
      </div>
    `;
    return section;
  }

  function injectTrustSections(main) {
    if (main.querySelector('[data-trust-section="author"]')) return;

    const anchor =
      main.querySelector(".app-promo-banner") ||
      main.querySelector(".related-links") ||
      main.querySelector("script:last-of-type");

    const fragment = document.createDocumentFragment();
    fragment.appendChild(createMethodologySection());
    fragment.appendChild(createReferencesSection());
    fragment.appendChild(createDisclaimerSection());
    fragment.appendChild(createAuthorCard());

    if (anchor) {
      anchor.parentNode.insertBefore(fragment, anchor);
    } else {
      main.appendChild(fragment);
    }
  }

  function injectPersonSchema() {
    if (document.getElementById("eeat-person-schema")) return;

    document.head.appendChild(
      createSchemaScript("eeat-person-schema", {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Lukas Pietruschka",
        jobTitle: "Founder of CannaClear",
        description:
          "Founder of CannaClear, recovery researcher, and product builder focused on cannabis withdrawal, dopamine recovery, habit formation, behavioral psychology, and long-term recovery.",
        url: "https://www.cannaclear.app/about",
        worksFor: {
          "@type": "Organization",
          name: "CannaClear",
          url: "https://www.cannaclear.app"
        },
        image: "https://www.cannaclear.app/assets/cannaclear-app-icon.webp"
      })
    );
  }

  function injectBreadcrumbSchema() {
    if (document.getElementById("eeat-breadcrumb-schema")) return;

    const path = normalizePath(window.location.pathname);
    const h1 = document.querySelector("main.seo-card h1");
    if (!h1) return;

    document.head.appendChild(
      createSchemaScript("eeat-breadcrumb-schema", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.cannaclear.app/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: h1.textContent.trim(),
            item: `https://www.cannaclear.app${path}`
          }
        ]
      })
    );
  }

  function initTrustSystem() {
    injectOrganizationSchema();

    if (!isArticlePage()) return;

    const main = getArticleMain();
    if (!main) return;

    injectArticleMeta(main);
    injectTrustSections(main);
    injectPersonSchema();
    injectBreadcrumbSchema();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTrustSystem);
  } else {
    initTrustSystem();
  }
})();
