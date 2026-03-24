# JSON-LD Schema Markup — CannaClear (alle 9 Seiten)

## Wie du es einfügst

Kopiere den jeweiligen `<script>`-Block und füge ihn in den `<head>` der entsprechenden Seite ein — direkt vor dem schließenden `</head>` Tag.

---

## 1. Homepage (cannaclear.app/)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "CannaClear",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS",
      "description": "CannaClear is a quit weed app and cannabis detox companion for people who want to stop smoking weed, manage cannabis cravings, and track sober-day progress with clear daily structure.",
      "url": "https://www.cannaclear.app",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      },
      "featureList": [
        "Sober day tracker with withdrawal milestone markers",
        "Daily check-in for mood, sleep and craving intensity",
        "Craving log with trigger context",
        "SOS screen with box breathing and grounding tools",
        "Money saved calculator",
        "Progress dashboard"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is CannaClear?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CannaClear is a quit weed app built specifically for people who want to stop smoking cannabis. It provides a sober day tracker, daily check-ins, craving management tools, withdrawal milestone guidance, and a money saved calculator."
          }
        },
        {
          "@type": "Question",
          "name": "Is CannaClear free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CannaClear is currently in pre-launch. You can join the early access list at cannaclear.app to be first to try the app when it launches on the App Store."
          }
        },
        {
          "@type": "Question",
          "name": "Does CannaClear work for gradual reduction as well as quitting completely?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. CannaClear supports both controlled reduction and full cessation. You do not need to set a fixed goal upfront — the app supports whichever approach you choose."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## 2. /weed-withdrawal

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does weed withdrawal last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most people, acute symptoms resolve within 2–3 weeks. Sleep and mood may take slightly longer — up to 4–6 weeks for heavier users."
      }
    },
    {
      "@type": "Question",
      "name": "Is weed withdrawal dangerous?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike alcohol or opioid withdrawal, cannabis withdrawal is not considered medically dangerous for most people. However, significant psychological distress warrants professional attention."
      }
    },
    {
      "@type": "Question",
      "name": "Can I manage weed withdrawal without medication?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The majority of people manage cannabis withdrawal without pharmacological support. Behavioural strategies — tracking, exercise, structured breathing, trigger management — are the primary tools."
      }
    },
    {
      "@type": "Question",
      "name": "Will I sleep normally again after quitting weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Sleep disruption during cannabis withdrawal is temporary. REM sleep rebounds after withdrawal and most people experience normal, often improved, sleep quality within 3–6 weeks."
      }
    },
    {
      "@type": "Question",
      "name": "Does everyone experience weed withdrawal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Withdrawal severity correlates with regularity and duration of use. Occasional users rarely experience significant symptoms. Daily users of high-potency cannabis are most likely to experience a defined withdrawal syndrome."
      }
    }
  ]
}
</script>
```

---

## 3. /quit-weed

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to quit weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Acute withdrawal resolves within 2–3 weeks for most people. Building stable new habits typically takes 60–90 days of consistent practice."
      }
    },
    {
      "@type": "Question",
      "name": "Is quitting weed hard?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is challenging for regular users, particularly in the first two weeks. The difficulty is real and neurologically grounded — but it is also temporary and manageable with the right approach."
      }
    },
    {
      "@type": "Question",
      "name": "Can I quit weed on my own without professional help?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Many people successfully quit without formal clinical support. Structured self-monitoring, craving management tools, and social accountability are the key ingredients."
      }
    },
    {
      "@type": "Question",
      "name": "What if I fail the first time I try to quit weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Multiple attempts are normal and do not predict long-term outcomes negatively. Each attempt provides information about what needs to change. Persistence is the primary determinant of eventual success."
      }
    },
    {
      "@type": "Question",
      "name": "Will my mental health improve after quitting weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most people, yes — particularly those who used cannabis to manage anxiety or low mood. Short-term there may be a temporary worsening during withdrawal; medium-to-long-term, the majority of people report significant improvement in mood, motivation, and clarity."
      }
    }
  ]
}
</script>
```

---

## 4. /how-to-quit-weed

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "name": "How to Quit Weed: A Step-by-Step Guide",
      "description": "A practical, evidence-based step-by-step plan for stopping cannabis use, managing withdrawal, and building lasting habits.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Make the decision specific",
          "text": "Set a specific quit date within the next 7–14 days, write it down, and tell at least one person. Vague intentions produce vague outcomes — a defined date is the foundation of a successful quit attempt."
        },
        {
          "@type": "HowToStep",
          "name": "Understand what is coming",
          "text": "Learn the withdrawal timeline: days 1–3 bring onset symptoms, days 4–7 are the peak difficulty, and days 8–14 show gradual stabilisation. Knowing what to expect converts alarming symptoms into manageable, expected experiences."
        },
        {
          "@type": "HowToStep",
          "name": "Audit and remove your triggers",
          "text": "Identify your personal cue categories — time-based, social, environmental, emotional, and cognitive triggers. Remove cannabis and paraphernalia from your home before your quit date and prepare responses for unavoidable triggers."
        },
        {
          "@type": "HowToStep",
          "name": "Prepare your craving response",
          "text": "Choose at least two craving responses in advance: box breathing (4-4-4-4), the 20-minute rule, movement, environment change, or contacting someone. Having a pre-planned response removes the need to decide under pressure."
        },
        {
          "@type": "HowToStep",
          "name": "Build replacement habits",
          "text": "Identify what function cannabis served — stress relief, sleep aid, boredom management — and prepare a specific substitute for your 2–3 highest-risk moments in the daily routine."
        },
        {
          "@type": "HowToStep",
          "name": "Track your progress visibly",
          "text": "Record sober days, cravings, money saved, mood, and sleep daily. Visible progress sustains commitment when motivation fluctuates, particularly in the difficult early weeks."
        },
        {
          "@type": "HowToStep",
          "name": "Handle setbacks without abandoning the process",
          "text": "If relapse occurs, stop as quickly as possible, identify the trigger, adjust your plan specifically for that trigger, reset your quit date, and continue. Cumulative sober time still has value — progress is not binary."
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long does it actually take to quit weed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Acute withdrawal resolves for most people within 2–3 weeks. Building stable new habits and reaching a point where cannabis feels like a genuine choice rather than a default takes most people 60–90 days of consistent effort."
          }
        },
        {
          "@type": "Question",
          "name": "What is the hardest part of quitting weed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Days 4–7 are consistently the most difficult — the point where initial motivation has faded and withdrawal symptoms are at their peak. Having a specific plan for this window is the most important preparation you can do."
          }
        },
        {
          "@type": "Question",
          "name": "Is it easier to quit weed gradually or all at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Both approaches work. Gradual reduction reduces withdrawal severity but requires a strict endpoint. Cold turkey is more intense early but resolves faster. The most important factor is having a defined quit date regardless of method."
          }
        },
        {
          "@type": "Question",
          "name": "What if I have tried to quit weed before and failed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Previous attempts indicate that something in the approach needs to change — not that quitting is impossible. The most common gaps are insufficient environmental preparation, no craving response plan, and no tracking system."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## 5. /quit-weed-timeline

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does the weed withdrawal timeline last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most people, acute withdrawal symptoms resolve within 2–3 weeks. The full recovery timeline — including mood stabilisation, cognitive improvement, and sleep normalisation — typically spans 60–90 days for regular users."
      }
    },
    {
      "@type": "Question",
      "name": "When is weed withdrawal at its worst?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Days 4–7 are typically the most difficult. Anxiety peaks, mood is lowest, cravings are most frequent, and sleep disruption is at its worst during this window. After day 7, symptoms begin to ease substantially for most people."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to your body after 30 days of not smoking weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "By 30 days, most people report significantly improved mental clarity, stabilised mood, normalised sleep, reduced craving frequency, and measurably improved energy levels. Research also shows meaningful improvement in working memory and executive function at this point."
      }
    },
    {
      "@type": "Question",
      "name": "How long does THC stay in your system after quitting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "THC detection windows vary: 3–4 days for single use, 5–7 days for occasional use, 10–15 days for daily use, and up to 30+ days for heavy daily use over months or years. These are detection windows, not indicators of impairment."
      }
    },
    {
      "@type": "Question",
      "name": "Does the quit weed timeline differ for heavy users?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Heavy, long-term daily users experience more pronounced and longer-lasting withdrawal than lighter users. Some may experience a post-acute withdrawal phase with mild symptoms — mainly sleep variability and occasional low mood — persisting for 1–3 months. These symptoms improve progressively."
      }
    }
  ]
}
</script>
```

---

## 6. /weed-detox

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does a weed detox take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Biological THC clearance takes 3–30+ days depending on usage frequency. Neurological recalibration — the process that determines how you feel — takes longer: acute symptoms resolve within 2–3 weeks, with full cognitive and mood recovery typically spanning 60–90 days for regular users."
      }
    },
    {
      "@type": "Question",
      "name": "How do I detox from weed fast?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Biological THC clearance cannot be meaningfully accelerated by any commercially available product or method. Exercise, good nutrition, adequate hydration, and sleep hygiene support the process but do not dramatically shorten it. Neurological detox follows its own timeline."
      }
    },
    {
      "@type": "Question",
      "name": "Do detox drinks or kits work for weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There is no clinical evidence that commercial detox drinks, supplements, or kits accelerate THC clearance in any meaningful way. They do not shorten withdrawal or the neurological recalibration process."
      }
    },
    {
      "@type": "Question",
      "name": "Will I feel better after a cannabis detox?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For the vast majority of regular users, yes — significantly so. Improved sleep, clearer thinking, more stable mood, and increased motivation are the most commonly reported outcomes at 30–60 days of abstinence."
      }
    },
    {
      "@type": "Question",
      "name": "Is it safe to detox from weed at home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most people, yes. Cannabis withdrawal is not medically dangerous for otherwise healthy individuals. If you have pre-existing mental health conditions or are simultaneously withdrawing from alcohol, consulting a GP is recommended."
      }
    }
  ]
}
</script>
```

---

## 7. /stop-smoking-weed

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to stop craving weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Craving frequency and intensity typically reduce substantially by weeks 3–4. Occasional situational cravings — triggered by specific cues — can persist for several months but become significantly less intense and easier to manage over time."
      }
    },
    {
      "@type": "Question",
      "name": "Can you stop smoking weed without withdrawal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Occasional users often experience minimal withdrawal. For daily users, some degree of withdrawal is typical. Severity depends on frequency, duration, and the THC concentration of cannabis used."
      }
    },
    {
      "@type": "Question",
      "name": "What helps most when stopping weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Across cessation research, the most consistently supported factors are structured tracking, social accountability, planned craving responses, and regular exercise. No single factor is decisive — the combination matters most."
      }
    },
    {
      "@type": "Question",
      "name": "Is it normal to feel depressed after stopping weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, transiently. THC artificially elevates dopamine activity; when removed, dopamine signalling is temporarily suppressed. This typically resolves within 2–4 weeks as the neurological system recalibrates. Persistent significant depression beyond 4 weeks warrants professional attention."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best way to stop smoking weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective approach combines a specific quit date, environmental preparation (removing cannabis and paraphernalia), trigger identification and planned responses, replacement habits for the highest-risk moments, and daily progress tracking. Willpower alone is the least reliable method."
      }
    }
  ]
}
</script>
```

---

## 8. /weed-addiction

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is weed physically addictive?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, for regular users. Physical dependence — defined by tolerance and withdrawal symptoms — is clinically documented in regular cannabis users. Approximately 9% of all people who try cannabis develop dependence; among daily users that figure rises to 25–50%."
      }
    },
    {
      "@type": "Question",
      "name": "Can you become addicted to weed if you only use occasionally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Occasional use rarely produces significant dependence. Risk increases substantially with frequency — daily use is the primary risk factor for cannabis use disorder."
      }
    },
    {
      "@type": "Question",
      "name": "How do I know if I'm addicted to weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The clearest indicator is attempting to stop or reduce and finding you cannot sustain it despite genuine intention. Other diagnostic indicators include withdrawal symptoms when stopping, persistent cravings, continued use despite negative consequences, and giving up other activities to use cannabis."
      }
    },
    {
      "@type": "Question",
      "name": "Can cannabis addiction be treated without medication?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. There are currently no approved pharmacological treatments specifically for cannabis use disorder. Behavioural approaches — Cognitive Behavioural Therapy (CBT), self-monitoring, motivational techniques — are the primary and effective treatment modalities."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between cannabis dependence and addiction?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dependence refers to physiological adaptation — tolerance and withdrawal. Addiction (or use disorder) involves dependence plus loss of control over use and continued use despite negative consequences. A person can be dependent on cannabis without having a severe use disorder."
      }
    }
  ]
}
</script>
```

---

## 9. /quit-weed-app

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is there an app specifically for quitting weed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — CannaClear is built specifically for cannabis cessation. Most other sobriety apps are designed for alcohol or general substance use and do not include cannabis-specific withdrawal tracking or milestone timelines."
      }
    },
    {
      "@type": "Question",
      "name": "Do quit weed apps actually work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Apps built around behavioural self-monitoring principles — streak tracking, craving logging, progress visualisation — are consistent with the evidence base for cessation support. An app is more likely to help than not, provided it includes active craving management tools rather than passive tracking only."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best free quit weed app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Several general sobriety trackers are free (I Am Sober, Quitzilla). For cannabis-specific support with withdrawal milestone tracking and craving tools, CannaClear offers early access at cannaclear.app."
      }
    },
    {
      "@type": "Question",
      "name": "Can an app help with weed withdrawal symptoms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An app can help by providing craving tools such as breathing exercises and grounding prompts, contextualising symptoms against the withdrawal timeline, and making progress visible. It does not reduce physical symptoms pharmacologically, but it can meaningfully reduce psychological distress during withdrawal."
      }
    },
    {
      "@type": "Question",
      "name": "What should a quit weed app include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An effective quit weed app should include a sober day tracker with milestone markers, a craving log with trigger context, an immediately accessible SOS craving tool, withdrawal timeline guidance, a money saved calculator, and daily mood and sleep check-ins."
      }
    }
  ]
}
</script>
```

---

## Testen

Nach dem Einfügen kannst du jede Seite hier prüfen:
→ https://search.google.com/test/rich-results

URL eingeben → "URL testen" → Google zeigt dir ob das Schema korrekt erkannt wird und welche Rich Results freigeschaltet sind.
