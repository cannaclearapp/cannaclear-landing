import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const research = {
  cannabis: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11063887/",
  engagement: "https://pubmed.ncbi.nlm.nih.gov/37794916/",
  monitoring: "https://pubmed.ncbi.nlm.nih.gov/33617740/"
};

const features = [
  {
    slug: "sobriety-tracker",
    icon: "target",
    title: "Cannabis Sobriety Tracker",
    meta: "Track cannabis-free days, personal milestones, and your progress with CannaClear's private sobriety tracker for iPhone.",
    heading: "Keep your cannabis-free progress visible",
    intro: "CannaClear turns your quit date into a clear, personal record of cannabis-free days and milestones. It is designed to help you notice progress without treating a streak as a measure of your worth.",
    image: "mockup-home.webp",
    width: 640,
    height: 1228,
    alt: "CannaClear home screen showing cannabis-free days and recovery progress",
    capabilities: [
      ["calendar", "Count cannabis-free days", "Set your quit date and see the time that has passed in one consistent place."],
      ["flag", "Mark meaningful milestones", "Use visible milestones as reminders of the work you have already done."],
      ["refresh", "Continue after a difficult day", "A lapse can be recorded honestly without turning the entire recovery process into a pass-or-fail score."]
    ],
    useTitle: "A record, not a judgment",
    useText: "A sobriety counter can make an abstract goal more concrete. CannaClear shows elapsed time and milestones so you can review progress at a glance. The tracker does not decide whether your recovery is successful, and it does not replace a treatment plan.",
    list: ["Choose a quit date that reflects your actual plan.", "Review progress when motivation feels less immediate.", "Use milestones as context alongside sleep, mood, cravings, and support."],
    researchText: "Self-monitoring and feedback are common behavior-change techniques in digital health tools. A 2024 systematic review of digital cannabis interventions found that feedback on behavior was frequently used, while also concluding that more high-quality research is needed. This supports the design principle behind visible progress; it does not establish that CannaClear itself causes abstinence.",
    limit: "The counter reflects the date and information you enter. It cannot verify abstinence, predict relapse, or assess cannabis use disorder. A reset is data, not a diagnosis or a moral verdict.",
    guides: [["quit-weed-timeline", "Quit weed timeline"], ["quit-weed-1-month", "One month after quitting"], ["benefits-of-quitting-weed-timeline", "Benefits timeline"]],
    related: ["symptom-tracking", "money-saved", "progress-insights"]
  },
  {
    slug: "symptom-tracking",
    icon: "chart",
    title: "Cannabis Withdrawal Symptom Tracker",
    meta: "Record cannabis withdrawal symptoms, cravings, and daily changes with CannaClear's structured, private recovery check-ins.",
    heading: "Track changes without turning them into a diagnosis",
    intro: "CannaClear provides structured check-ins for recording how you feel, what you notice, and what may have influenced the day. The goal is a clearer personal record, not automated medical interpretation.",
    image: "mockup-progress.webp",
    width: 560,
    height: 1075,
    alt: "CannaClear progress screen showing recovery patterns and milestones",
    capabilities: [
      ["list", "Use consistent check-ins", "Record changes in a repeatable format instead of relying only on memory."],
      ["wave", "Notice symptom patterns", "Compare difficult and steadier days across your own recovery record."],
      ["users", "Bring useful context to support", "A personal log can help you describe timing and patterns more clearly to a qualified professional."]
    ],
    useTitle: "Useful context for a variable process",
    useText: "Cannabis withdrawal can vary between people and across days. Tracking can make that variation easier to see, especially when sleep, cravings, mood, and routines interact. CannaClear does not label symptoms as normal or abnormal for you.",
    list: ["Log at roughly the same time when practical.", "Record context such as sleep, stress, and cravings.", "Seek professional support for severe, persistent, or worsening symptoms."],
    researchText: "Research on self-monitoring in substance use suggests it may increase awareness of patterns under some circumstances, but the evidence is heterogeneous. Digital cannabis interventions often combine monitoring with feedback and other techniques. CannaClear uses these principles as a design framework, not as proof of clinical effectiveness.",
    limit: "CannaClear is not a medical device and does not diagnose withdrawal, score severity, or determine whether a symptom is caused by cannabis. Urgent or concerning symptoms require appropriate professional care.",
    guides: [["weed-withdrawal", "Weed withdrawal"], ["track-weed-withdrawal", "How to track withdrawal"], ["weed-withdrawal-symptoms", "Withdrawal symptoms"]],
    related: ["sobriety-tracker", "recovery-journal", "progress-insights"]
  },
  {
    slug: "craving-sos",
    icon: "lifebuoy",
    title: "Cannabis Craving SOS Tools",
    meta: "Use guided breathing, grounding prompts, and a clear next step when cannabis cravings feel intense with CannaClear for iPhone.",
    heading: "A calmer next step when a craving hits",
    intro: "The CannaClear SOS area offers guided breathing, grounding ideas, and simple prompts for the immediate moment. It is designed to reduce decision load while you choose what to do next.",
    image: "mockup-sos.webp",
    width: 560,
    height: 1075,
    alt: "CannaClear craving SOS screen with immediate coping tools",
    capabilities: [
      ["bolt", "Open one clear action", "Move from an urge to a concrete coping step without searching through a long article."],
      ["cloud", "Follow a breathing prompt", "Use guided box breathing as a structured pause, if breathing exercises feel appropriate for you."],
      ["target", "Reconnect with your plan", "Create enough space to choose support, change your environment, or revisit your reasons for quitting."]
    ],
    useTitle: "Support for the moment, not emergency care",
    useText: "Cravings can narrow attention and make familiar responses feel automatic. The SOS tools organize simple coping options in one place. They do not guarantee that an urge will stop, and different techniques work differently for different people.",
    list: ["Open the tool early rather than waiting for the urge to feel unmanageable.", "Pair an in-app prompt with a real-world action such as leaving a trigger situation.", "Contact a trusted person or professional when self-guided tools are not enough."],
    researchText: "Behavioral approaches to cannabis use commonly include identifying triggers and practicing coping responses. Reviews of digital interventions suggest potential benefits, but interventions vary and the evidence does not validate every individual feature. CannaClear's SOS tools are practical prompts, not a clinically tested treatment protocol.",
    limit: "The SOS screen is not a crisis service, medical treatment, or substitute for professional help. If you may harm yourself or someone else, or face a medical emergency, contact local emergency services immediately.",
    guides: [["stop-weed-cravings", "How to stop weed cravings"], ["urge-to-smoke-weed", "Handle the urge to smoke"], ["how-to-deal-with-weed-cravings-at-night", "Nighttime cravings"]],
    related: ["recovery-journal", "symptom-tracking", "sobriety-tracker"]
  },
  {
    slug: "recovery-journal",
    icon: "pencil",
    title: "Quit Weed Recovery Journal",
    meta: "Use structured daily check-ins and private journal entries to reflect on cravings, triggers, mood, and cannabis recovery with CannaClear.",
    heading: "Turn difficult days into useful context",
    intro: "CannaClear combines free-form journal entries with structured check-ins for cravings, triggers, mood, and what helped. You decide what to record and how often to return.",
    image: "mockup-journal.webp",
    width: 560,
    height: 1075,
    alt: "CannaClear recovery journal with daily check-ins, mood, triggers, and notes",
    capabilities: [
      ["pencil", "Write in your own words", "Capture details that fixed categories cannot express."],
      ["search", "Look for repeated triggers", "Review entries to notice situations, thoughts, and responses that appear more than once."],
      ["heart", "Record what helped", "Keep successful coping actions visible alongside difficult moments." ]
    ],
    useTitle: "Reflection with structure",
    useText: "A journal can help separate what happened from what you felt and what you did next. Structured prompts make entries easier to compare, while free-form notes preserve the context that matters to you.",
    list: ["Keep entries brief enough to sustain.", "Record triggers without blaming yourself for having them.", "Review patterns periodically rather than treating each day as a verdict."],
    researchText: "Self-monitoring, feedback, prompts, and goal setting are frequently used behavior-change techniques in mobile health apps. Research can explain why these components are plausible design choices, but it does not show that journaling alone prevents relapse or that CannaClear is equivalent to therapy.",
    limit: "Journal prompts are educational and reflective. They do not interpret your mental health, diagnose a condition, or provide confidential therapy. App progress data is described as primarily local in our Privacy Policy; review that policy for the current details and exceptions.",
    guides: [["quit-weed-journal", "Quit weed journal prompts"], ["preventing-cannabis-relapse", "Relapse prevention"], ["who-am-i-without-weed", "Identity after quitting"]],
    related: ["craving-sos", "symptom-tracking", "progress-insights"]
  },
  {
    slug: "money-saved",
    icon: "coins",
    title: "Money Saved After Quitting Weed",
    meta: "Estimate and track the money you may save after quitting cannabis with CannaClear's progress dashboard for iPhone.",
    heading: "Make the financial side of quitting visible",
    intro: "CannaClear can translate the spending information you enter into an estimate of money not spent over time. The figure is a personal progress estimate, not a bank balance or financial forecast.",
    image: "mockup-home.webp",
    width: 640,
    height: 1228,
    alt: "CannaClear dashboard showing estimated money saved after quitting cannabis",
    capabilities: [
      ["coins", "Estimate money not spent", "Use your own prior spending information to create a simple running estimate."],
      ["trend", "Connect time with a tangible result", "See how small daily amounts can accumulate across a longer period."],
      ["target", "Choose what the number means", "Use the estimate as motivation, a budgeting prompt, or simply another recovery milestone." ]
    ],
    useTitle: "A transparent estimate",
    useText: "The calculation is based on the information you provide and the time recorded by the app. It can make an otherwise invisible benefit easier to notice, but it cannot account for every change in spending or personal circumstances.",
    list: ["Enter a realistic average rather than an idealized number.", "Update assumptions if your previous spending varied substantially.", "Treat the result as an estimate, not verified savings."],
    researchText: "Behavior-change research often uses feedback and focus on past progress to support engagement. That makes a savings estimate a reasonable feedback mechanism. It does not mean that displaying money saved causes abstinence or guarantees a financial outcome.",
    limit: "CannaClear does not connect to bank accounts, verify purchases, provide financial advice, or guarantee savings. The displayed amount depends on the assumptions and dates you enter.",
    guides: [["weed-sobriety-app", "Weed sobriety apps"], ["quit-weed-timeline", "Quit weed timeline"], ["benefits-of-quitting-weed-timeline", "Benefits of quitting"]],
    related: ["sobriety-tracker", "progress-insights", "recovery-journal"]
  },
  {
    slug: "progress-insights",
    icon: "chart",
    title: "Cannabis Recovery Progress Insights",
    meta: "Review self-reported recovery patterns, check-ins, and milestones in CannaClear without automated medical diagnosis or predictions.",
    heading: "See patterns that are easy to miss day to day",
    intro: "CannaClear organizes your check-ins and progress into a clearer view over time. Insights reflect the information you record; they are designed for self-observation, not medical prediction.",
    image: "mockup-progress.webp",
    width: 560,
    height: 1075,
    alt: "CannaClear progress screen with self-reported recovery patterns and insights",
    capabilities: [
      ["chart", "Review change over time", "Move beyond a single difficult day by looking at a longer personal record."],
      ["search", "Notice possible patterns", "Compare check-ins, triggers, cravings, and milestones without assuming that correlation proves a cause."],
      ["flag", "Keep progress in context", "Use trends as one input alongside your lived experience and professional guidance when needed." ]
    ],
    useTitle: "Your data, carefully framed",
    useText: "Progress is rarely linear. A structured view can help you notice gradual change, but it should not be read as a clinical score or a universal recovery timeline. Your entries remain the source of the displayed patterns.",
    list: ["Look at several entries before drawing a conclusion.", "Consider sleep, stress, environment, and support as possible context.", "Use professional assessment for medical or mental-health decisions."],
    researchText: "Feedback on behavior and self-monitoring are common components of digital interventions. A systematic review of digital cannabis interventions found promising group-level results while emphasizing important evidence gaps. CannaClear applies these established design concepts, but its insights have not been validated as a clinical outcome measure.",
    limit: "Insights do not diagnose, forecast recovery, identify causation, or recommend treatment. They summarize self-reported information and may be incomplete or inaccurate when entries are missing.",
    guides: [["track-weed-withdrawal", "Track weed withdrawal"], ["brain-recovery-after-quitting-weed", "Brain recovery"], ["feel-normal-after-quitting-weed", "Feeling normal again"]],
    related: ["symptom-tracking", "sobriety-tracker", "recovery-journal"]
  }
];

const names = Object.fromEntries(features.map((item) => [item.slug, item.title]));
const short = {
  "sobriety-tracker": "Track cannabis-free days and milestones.",
  "symptom-tracking": "Record daily changes without automated diagnosis.",
  "craving-sos": "Open breathing and grounding tools in difficult moments.",
  "recovery-journal": "Reflect on triggers, mood, and what helped.",
  "money-saved": "Estimate money not spent after quitting.",
  "progress-insights": "Review self-reported patterns over time."
};

function icon(id, className = "icon") {
  return `<svg class="${className}" aria-hidden="true"><use href="/assets/article-icons.svg#i-${id}"></use></svg>`;
}

function page(feature) {
  const url = `https://www.cannaclear.app/features/${feature.slug}`;
  const related = feature.related.map((slug) => `<a href="/features/${slug}"><span class="feature-related-icon">${icon(features.find((f) => f.slug === slug).icon)}</span><span><strong>${names[slug]}</strong><span>${short[slug]}</span></span></a>`).join("\n");
  const capabilities = feature.capabilities.map(([symbol, title, text]) => `<article class="feature-capability">${icon(symbol)}<h3>${title}</h3><p>${text}</p></article>`).join("\n");
  const guides = feature.guides.map(([slug, title]) => `<li><a href="/${slug}">${title}</a></li>`).join("\n");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="apple-itunes-app" content="app-id=6761284274" />
    <link rel="icon" type="image/png" href="/favicon.png?v=4" />
    <link rel="shortcut icon" href="/favicon.ico?v=4" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png?v=4" />
    <title>${feature.title} | CannaClear</title>
    <meta name="description" content="${feature.meta}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${feature.title} | CannaClear" />
    <meta property="og:description" content="${feature.meta}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="https://www.cannaclear.app/assets/og-image-v2.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${feature.title} | CannaClear" />
    <meta name="twitter:description" content="${feature.meta}" />
    <meta name="twitter:image" content="https://www.cannaclear.app/assets/og-image-v2.png" />
    <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"WebPage",name:feature.title,description:feature.meta,url,isPartOf:{"@type":"WebSite",name:"CannaClear",url:"https://www.cannaclear.app"},about:{"@type":"SoftwareApplication",name:"CannaClear",applicationCategory:"HealthApplication",operatingSystem:"iOS",url:"https://www.cannaclear.app/download"},publisher:{"@type":"Organization",name:"CannaClear",url:"https://www.cannaclear.app",logo:"https://www.cannaclear.app/assets/new/app-icon.webp"}})}</script>
    <script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://www.cannaclear.app"},{"@type":"ListItem",position:2,name:"Features",item:"https://www.cannaclear.app/features"},{"@type":"ListItem",position:3,name:feature.title,item:url}]})}</script>
    <link rel="stylesheet" href="/assets/article.css" />
  </head>
  <body>
    <header class="nav"><div class="nav-in"><a href="/" class="brand"><img src="/assets/new/app-icon.webp" alt="" width="32" height="32" />CannaClear</a><details class="nav-menu"><summary aria-label="Open navigation"><svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-list"></use></svg></summary><nav class="nav-menu-panel" aria-label="Mobile navigation"><a href="/features">Features <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a><a href="/guides">Guides <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a><a href="/quit-weed-timeline">Recovery Timeline <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a><a href="/about">About <svg class="icon" aria-hidden="true"><use href="/assets/article-icons.svg#i-chevright"></use></svg></a></nav></details><nav class="nav-links" aria-label="Main"><a href="/features">Features</a><a href="/guides">Guides</a><a href="/quit-weed-timeline">Recovery Timeline</a><a href="/about">About</a><a href="/download" class="nav-cta">Get the app</a></nav></div></header>
    <main class="feature-main">
      <section class="feature-hero">
        <div class="feature-hero-copy"><div class="crumb"><a href="/">Home</a> <span aria-hidden="true">›</span> <a href="/features">Features</a> <span aria-hidden="true">›</span> ${feature.title}</div><div class="feature-kicker">${icon(feature.icon)} CannaClear feature</div><h1>${feature.heading}</h1><p class="hero-sub">${feature.intro}</p><div class="feature-proof">${icon("shield")}<span><strong>Transparent by design:</strong> educational recovery support, not diagnosis or treatment. Claims on this page distinguish product functions from general research evidence.</span></div><div class="feature-actions"><a class="feature-primary" href="/download">Open CannaClear ${icon("chevright")}</a><a class="feature-secondary" href="/privacy">Read our privacy policy</a></div></div>
        <div class="feature-visual"><img src="/assets/new/${feature.image}" alt="${feature.alt}" width="${feature.width}" height="${feature.height}" decoding="async" /></div>
      </section>
      <section class="feature-band"><h2>What this feature does</h2><p class="feature-lead">A focused set of tools for recording and understanding your own recovery experience.</p><div class="feature-capabilities">${capabilities}</div></section>
      <section class="feature-band"><h2>How to use it responsibly</h2><p class="feature-lead">The most useful record is consistent enough to reveal context, but flexible enough to reflect real life.</p><div class="feature-split"><div class="feature-panel"><h3>${feature.useTitle}</h3><p>${feature.useText}</p><ul>${feature.list.map((item) => `<li>${item}</li>`).join("")}</ul></div><aside class="feature-panel"><h3>Related recovery guides</h3><p>Use the feature alongside deeper educational guidance:</p><ul>${guides}</ul></aside></div></section>
      <section class="feature-band"><h2>Research context and limitations</h2><p class="feature-lead">CannaClear uses established behavior-change concepts as product design inputs. That is different from claiming that this app has proven clinical efficacy.</p><div class="feature-panel feature-research"><div class="research-label">${icon("flask")} Evidence-aware product design</div><p>${feature.researchText}</p><p><strong>Important distinction:</strong> This research does not establish clinical efficacy for CannaClear, and CannaClear has not been presented as a clinically validated treatment.</p><p><strong>Research used for context:</strong> <a href="${research.cannabis}" target="_blank" rel="noopener noreferrer">2024 systematic review of digital cannabis interventions</a>; <a href="${research.engagement}" target="_blank" rel="noopener noreferrer">2023 systematic review of behavior-change techniques and app engagement</a>; <a href="${research.monitoring}" target="_blank" rel="noopener noreferrer">systematic review of self-monitoring in substance use</a>.</p></div><div class="feature-limits">${icon("alert")}<div><h3>What this feature does not do</h3><p>${feature.limit}</p></div></div></section>
      <section class="feature-band"><h2>Explore other CannaClear tools</h2><p class="feature-lead">Recovery is broader than one metric. Combine only the tools that are useful for you.</p><div class="feature-related">${related}</div></section>
      <section class="feature-final"><div><h2>Build a clearer recovery record</h2><p>Use CannaClear as a private, practical companion to your own plan and any professional support you choose.</p></div><a class="feature-primary" href="/download">Download on the App Store ${icon("chevright")}</a></section>
      <div class="disclaimer"><div class="disclaimer-icon">${icon("info")}</div><p><strong>Medical note.</strong> CannaClear provides educational information and self-tracking tools. It does not replace professional medical advice, diagnosis, or treatment. Read the <a href="/medical-disclaimer">full medical disclaimer</a>.</p></div>
    </main>
    <footer class="footer"><div class="shell"><span>© 2026 CannaClear</span><a href="/about">About</a><a href="/editorial-policy">Editorial Policy</a><a href="/medical-disclaimer">Medical Disclaimer</a><a href="/privacy">Privacy</a><a href="/support">Support</a></div></footer>
    <script defer src="/_vercel/insights/script.js"></script><script defer src="/_vercel/speed-insights/script.js"></script>
  </body>
</html>`;
}

for (const feature of features) {
  const html = page(feature);
  for (const base of [root, path.join(root, "public")]) {
    const dir = path.join(base, "features", feature.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  }
}

const contextual = [
  ["quit-weed-timeline", "sobriety-tracker", "Want a simple way to keep milestones visible? See how the {{link}} records cannabis-free days without turning recovery into a pass-or-fail score.", "CannaClear sobriety tracker"],
  ["track-weed-withdrawal", "symptom-tracking", "For structured daily records, explore {{link}} and its clear limits as a self-observation tool rather than a diagnosis.", "CannaClear symptom tracking"],
  ["stop-weed-cravings", "craving-sos", "When an urge needs an immediate next step, the {{link}} puts breathing and grounding prompts in one place.", "CannaClear Craving SOS feature"],
  ["quit-weed-journal", "recovery-journal", "Prefer guided reflection? The {{link}} combines free-form notes with structured check-ins for triggers and what helped.", "CannaClear recovery journal"],
  ["weed-sobriety-app", "money-saved", "{{link}} can estimate money saved from the spending information you enter, with the calculation clearly presented as an estimate.", "CannaClear's money-saved tracker"],
  ["dopamine-recovery-after-weed", "progress-insights", "Because gradual changes are easy to miss, {{link}} organize your self-reported check-ins without presenting them as a clinical score.", "CannaClear progress insights"]
];

for (const [article, slug, text, label] of contextual) {
  for (const base of [root, path.join(root, "public")]) {
    const file = path.join(base, article, "index.html");
    let html = fs.readFileSync(file, "utf8");
    if (html.includes(`/features/${slug}`)) continue;
    const linkedText = text.replace("{{link}}", `<a href="/features/${slug}">${label}</a>`);
    const block = `<p class="feature-context-link">${icon(features.find((f) => f.slug === slug).icon)}<span>${linkedText}</span></p>`;
    html = html.replace(/(\s*<div class="cta reveal">)/, `\n${block}$1`);
    fs.writeFileSync(file, html);
  }
}
