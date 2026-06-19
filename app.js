(() => {
  "use strict";

  const APP_VERSION = "3.0.0-visual-upgrade";
  const DAY_MS = 24 * 60 * 60 * 1000;

  const CONFIG = {
    start: localDate(2026, 6, 17),
    cutEnd: localDate(2026, 7, 20),
    dunkTarget: localDate(2026, 8, 20)
  };
  CONFIG.totalDays = diffDays(CONFIG.start, CONFIG.dunkTarget) + 1;

  const NAV = [
    ["today", "Today", "⚡"],
    ["training", "Train", "🏀"],
    ["meals", "Meals", "🍽️"],
    ["recovery", "Recover", "🛡️"],
    ["mind", "Mind", "🧠"],
    ["progress", "Logs", "📈"],
    ["safety", "Safety", "⚕️"]
  ];

  const RULES = [
    ["train", "🏋️", "Train the planned session", "Do the exact session that matches readiness. No ego volume."],
    ["fuel", "🍽️", "Protein + performance fuel", "Cut by trend. Carbs belong around lower/jump work."],
    ["recover", "😴", "Protect sleep and joints", "Warm up, cool down, walk, and downshift."],
    ["learn", "📚", "One hour learning", "Sports science, AI/coding, analytics, or music study."],
    ["deep", "🎯", "One hour deep work", "Bassoon repertoire or one shipped analytics improvement."],
    ["ground", "🌅", "Start from the why", "Five minutes breathing/journaling before the grind."],
  ];

  const WEEK = [
    {
      day: "MON",
      theme: "Push + low-contact plyo",
      am: ["PUSH — Strength", ["Bench press 4×5 at strong-but-clean effort", "Overhead press 3×6", "Incline DB press 3×8–10", "Shoulder/scapula prehab 8 minutes"]],
      pm: ["Plyo — Low contacts", ["Box jumps 4×3, full rest", "Rim/net touches 6–10 quality jumps", "Pogo jumps 3×15 seconds", "Calf isometrics 3×30 seconds"]],
      note: "Quality contacts only. No chasing fatigue jumps."
    },
    {
      day: "TUE",
      theme: "Pull + easy power",
      am: ["PULL — Strength", ["Weighted or assisted pull-ups 4×5", "Barbell or chest-supported row 4×6", "Face pulls 3×15", "Rear delt + rotator cuff 8 minutes"]],
      pm: ["Conditioning — Easy power", ["Tempo runs or bike 20–25 minutes", "Acceleration technique 6×10m", "Ankles + hips mobility"]],
      note: "Conditioning must leave legs fresher, not destroyed."
    },
    {
      day: "WED",
      theme: "Lower strength + approach skill",
      am: ["LOWER — Strength key day", ["Squat pattern 4×4–5 pain-free only", "RDL 4×6", "Bulgarian split squat 3×8 each", "Tibialis + calf work 3 rounds"]],
      pm: ["Approach jump skill", ["Warm up fully", "Approach jumps 8–12 total", "Depth drops 3×3 only if knees feel good", "Video 2 jumps for form"]],
      note: "If knee pain is 4/10+, replace jumps with bike + mobility."
    },
    {
      day: "THU",
      theme: "Recovery day",
      am: ["RECOVERY", ["30–45 minute easy walk", "Hip flexor and ankle mobility", "Breathing downshift 5 minutes"]],
      pm: ["RESET", ["Foam roll lightly", "Protein and hydration locked", "Early bedtime target"]],
      note: "This day makes Friday/Saturday work. Do not turn it into hidden training."
    },
    {
      day: "FRI",
      theme: "Upper power + plyo",
      am: ["UPPER — Power", ["Incline press 4×6–8", "Push press 3×3–5", "Lat pulldown 3×10", "Core anti-rotation 3×10 each"]],
      pm: ["Plyo — Horizontal + vertical", ["Broad jumps 5×3", "Hurdle hops 4×3", "Single-leg box jump 3×3 each", "Rim/net touches 6–10"]],
      note: "Stop while jumps are still snappy."
    },
    {
      day: "SAT",
      theme: "Lower power + test jumps",
      am: ["LOWER — Power key day", ["Trap bar deadlift or deadlift 4×3–5", "Leg press 2–3×10 controlled", "Hamstring curl 3×10", "Weighted calf raise 4×6–8"]],
      pm: ["Dunk-specific", ["Full approach jumps 12–20 total", "Track best touch", "Basketball/scrimmage only if legs feel elastic", "Long cooldown"]],
      note: "This is the testing day. Best jump, not most jumps."
    },
    {
      day: "SUN",
      theme: "Full rest + plan",
      am: ["FULL REST", ["No lifting", "No max jumps", "Walk if it helps recovery"]],
      pm: ["PLAN", ["Review check-ins", "Prep meals", "Set tomorrow's training window", "Sleep early"]],
      note: "A complete rest day is a performance tool."
    }
  ];

  const MEALS = {
    train: {
      title: "Training day",
      headline: "Fuel the jumps, not the cravings.",
      target: { kcal: "1,900–2,200", protein: "160–180g", carbs: "160–220g", fat: "50–70g" },
      meals: [
        ["07:30", "Protein breakfast", ["Eggs or Greek yogurt + whey", "Fruit or oats if morning training", "Water + salt if you wake flat"]],
        ["12:30", "Chicken / tuna / eggs lunch", ["Lean protein", "Rice, potato, wrap, or oats", "Vegetables you can repeat daily"]],
        ["60–90 min pre", "Pre-workout fuel", ["30–60g easy carbs", "20–40g protein", "No heavy fat right before jumps"]],
        ["Post", "Recovery meal", ["Protein first", "Carbs after leg/jump days", "Hydrate before caffeine"]],
        ["21:00", "Night protein", ["Cottage cheese / Greek yogurt / lean protein", "Prepare tomorrow before bed"]]
      ]
    },
    rest: {
      title: "Rest day",
      headline: "Recover without losing the cut.",
      target: { kcal: "1,800–2,050", protein: "160–180g", carbs: "100–160g", fat: "55–75g" },
      meals: [
        ["Morning", "Easy walk + breakfast", ["Protein anchor", "Fruit or vegetables", "No forced fasted grind if sleep is poor"]],
        ["Lunch", "Large simple meal", ["Lean protein", "Big vegetables", "Controlled carbs, not zero carbs"]],
        ["Afternoon", "Hunger bridge", ["Tuna, yogurt, cottage cheese, or eggs", "Water before extra snacks"]],
        ["Dinner", "Recovery dinner", ["Protein + vegetables", "Carbs if legs feel drained", "Stop chasing extreme restriction"]]
      ]
    },
    wrap: {
      title: "Wrap day",
      headline: "Simple, portable, repeatable.",
      target: { kcal: "1,900–2,150", protein: "170–200g", carbs: "140–200g", fat: "50–70g" },
      meals: [
        ["Breakfast", "Full protein breakfast", ["Eggs or yogurt + whey", "Banana if training soon"]],
        ["Lunch", "Tuna or chicken wrap", ["One high-protein wrap", "Lean filling", "Vegetables and low-cal sauce"]],
        ["Pre-workout", "Light fuel", ["Protein + optional fruit", "Avoid heavy fats pre-jump"]],
        ["Dinner", "Chicken + vegetables", ["Add rice/potato if the session was hard", "Keep the plan repeatable"]]
      ]
    }
  };

  const RECOVERY = [
    ["Warm-up before every lower/jump session", "5–8 min pulse raiser, ankles, hips, pogos, low jumps before intense contacts."],
    ["Pain rule", "0–2/10 is monitor. 3/10 is modify. 4/10+ or sharp pain is stop and swap to recovery."],
    ["Knee-clicking rule", "Clicking alone is not automatically a crisis, but pain, swelling, locking, or instability means stop and get assessed."],
    ["Deload", "Every fourth week, cut jump contacts and heavy lower volume by 30–50%."],
    ["Sleep floor", "Under 6 hours: remove max jumps. Under 5 hours: recovery-only day."],
    ["Jump contact cap", "Stop a plyo session the moment height, landing quality, or approach rhythm drops."],
  ];

  const MIND = {
    learning: [
      ["Sports science", "Vertical jump mechanics, landing tolerance, warm-up quality, and fatigue management."],
      ["AI & coding", "Upgrade tools, dashboards, and automation with clean validation."],
      ["Quant systems", "Model reliability, calibration, risk limits, and post-result review."],
      ["Music", "Score study, listening, bassoon repertoire, audition-style detail."],
    ],
    deep: [
      ["Bassoon repertoire", "One focused block. No phone. Choose the exact passage before starting."],
      ["Analytics build", "One small shipped improvement beats three hours of unfocused tinkering."],
    ]
  };

  const SAFETY = [
    ["No unapproved drug stack", "The app intentionally contains no peptide/SARM-style dosing. Only use medications or supplements that are legal, doctor-approved, and appropriate for you."],
    ["No crash-cut heroics", "If training performance, sleep, libido, mood, or joint tolerance collapses, the cut is too aggressive."],
    ["Stop signs", "Chest pain, faintness, severe shortness of breath, sharp tendon pain, swelling, locking, or neurological symptoms mean stop and get help."],
    ["Manual judgment beats app obedience", "This app is a checklist and command center. It is not a coach, doctor, physio, or permission slip."],
  ];

  const STORE = {
    rulesPrefix: "breakthrough.rules.v3.",
    checkins: "breakthrough.checkins.v3",
    oldCheckins: "breakthrough.checkins.v2"
  };

  const state = {
    nav: "today",
    dayIndex: todayWeekIndex(),
    mealType: "train",
    rules: getJSON(STORE.rulesPrefix + localKey(), {}),
    checkins: getJSON(STORE.checkins, getJSON(STORE.oldCheckins, {})),
    installPrompt: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function localDate(year, month, day) { return new Date(year, month - 1, day); }
  function todayLocal() { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
  function dateOnlyMs(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); }
  function diffDays(from, to) { return Math.round((dateOnlyMs(to) - dateOnlyMs(from)) / DAY_MS); }
  function localKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function todayWeekIndex() { const day = new Date().getDay(); return day === 0 ? 6 : day - 1; }
  function clamp(value, min, max) { return Math.min(max, Math.max(min, Number(value) || 0)); }
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }
  function getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function setJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function timeline() {
    const today = todayLocal();
    const dayNum = clamp(diffDays(CONFIG.start, today) + 1, 1, CONFIG.totalDays);
    const progress = Math.round((dayNum / CONFIG.totalDays) * 100);
    return {
      dayNum,
      progress,
      daysToCut: Math.max(0, diffDays(today, CONFIG.cutEnd)),
      daysToDunk: Math.max(0, diffDays(today, CONFIG.dunkTarget)),
      totalDays: CONFIG.totalDays
    };
  }

  function updateTopbar() {
    const t = timeline();
    $("#todayBadge").textContent = `Day ${t.dayNum}`;
  }

  function renderNav() {
    const nav = $("#navBar");
    nav.innerHTML = NAV.map(([id, label, icon]) => `
      <button id="tab-${id}" type="button" role="tab" aria-selected="${state.nav === id}" aria-controls="panel-${id}" data-nav="${id}">
        <span class="nav-icon" aria-hidden="true">${icon}</span>
        <span>${label}</span>
      </button>
    `).join("");

    NAV.forEach(([id]) => {
      const panel = $(`#panel-${id}`);
      panel.classList.toggle("is-active", state.nav === id);
      panel.setAttribute("role", "tabpanel");
      panel.hidden = state.nav !== id;
    });
  }

  function renderToday() {
    const done = RULES.filter(([key]) => state.rules[key]).length;
    const checklistPct = Math.round((done / RULES.length) * 100);
    const t = timeline();
    const todayPlan = WEEK[todayWeekIndex()];
    const latest = latestCheckin();
    const lastWeight = latest?.weight ? `${latest.weight}kg` : "--";
    const bestTouch = latest?.reach ? `${latest.reach}cm` : "--";

    $("#panel-today").innerHTML = `
      <div class="stack">
        <section class="command-card" aria-label="Today command center">
          <div class="command-card__inner">
            <div class="hero-grid">
              <div>
                <p class="kicker">Athlete command center · v3 redesign</p>
                <h2 class="hero-title">Build bounce without breaking.</h2>
                <p class="hero-copy">Today is ${escapeHTML(todayPlan.day)}: ${escapeHTML(todayPlan.theme)}. Hit the essentials, log the signals, and stop before fatigue steals tomorrow.</p>
              </div>
              <div class="ring" style="--progress:${t.progress}%" role="img" aria-label="${t.progress}% of protocol complete">
                <div class="ring__core"><div><strong>${t.progress}%</strong><span>complete</span></div></div>
              </div>
            </div>
            <div class="hero-metrics">
              ${metric(`Day ${t.dayNum}`, `of ${t.totalDays}`)}
              ${metric(`${t.daysToCut}d`, "cut deadline")}
              ${metric(`${t.daysToDunk}d`, "dunk target")}
            </div>
          </div>
        </section>

        <div id="readinessBox"></div>

        <section class="grid grid--three" aria-label="Quick status">
          <article class="card card--lime"><p class="section-kicker">Checklist</p><h3>${done}/${RULES.length} locked</h3><p>${checklistPct}% of the day is complete.</p></article>
          <article class="card card--sky"><p class="section-kicker">Latest weight</p><h3>${escapeHTML(lastWeight)}</h3><p>Use the 7-day trend, not one emotional weigh-in.</p></article>
          <article class="card"><p class="section-kicker">Best touch</p><h3>${escapeHTML(bestTouch)}</h3><p>Track highest quality touch, not most tired attempts.</p></article>
        </section>

        <section class="card" aria-label="Daily rules">
          <p class="section-kicker">Today rules</p>
          ${RULES.map(([key, icon, title, sub]) => ruleButton(key, icon, title, sub)).join("")}
        </section>

        ${checkinForm()}

        <article class="card card--dark">
          <p class="section-kicker">Non-negotiable filter</p>
          <h3>You are allowed to override the app.</h3>
          <p>If knees, sleep, or movement quality say “bad idea,” the correct upgrade is less volume, not more discipline.</p>
        </article>
      </div>
    `;
    renderReadiness();
    populateForm();
  }

  function latestCheckin() {
    return Object.values(state.checkins).filter(Boolean).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0] || null;
  }

  function metric(value, label) {
    return `<div class="metric"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`;
  }

  function ruleButton(key, icon, title, sub) {
    const done = !!state.rules[key];
    return `
      <button class="rule-row ${done ? "is-done" : ""}" type="button" aria-pressed="${done}" data-rule="${key}">
        <span class="checkbox" aria-hidden="true"></span>
        <span class="rule-row__icon" aria-hidden="true">${icon}</span>
        <span><span class="rule-title">${escapeHTML(title)}</span><span class="rule-sub">${escapeHTML(sub)}</span></span>
      </button>
    `;
  }

  function checkinForm() {
    return `
      <section class="input-card" aria-labelledby="checkinTitle">
        <p class="section-kicker" id="checkinTitle">Daily check-in</p>
        <div class="form-grid">
          ${field("weight", "Bodyweight kg", "number", "77.5", "0.1")}
          ${field("reach", "Best touch cm", "number", "", "0.5")}
          ${field("sleep", "Sleep hours", "number", "7.5", "0.25")}
          ${field("knee", "Knee pain 0–10", "number", "0", "1", "0", "10")}
          ${field("energy", "Energy 0–10", "number", "7", "1", "0", "10")}
          ${field("soreness", "Soreness 0–10", "number", "3", "1", "0", "10")}
          <div class="field field--wide"><label for="notes">Notes</label><textarea id="notes" placeholder="Training notes, music/deep work, pain signals, mood, best jump..."></textarea></div>
        </div>
        <div class="action-row">
          <button class="primary" type="button" data-action="save-checkin">Save check-in</button>
          <button class="secondary" type="button" data-action="clear-today">Clear today</button>
        </div>
      </section>
    `;
  }

  function field(id, label, type, placeholder, step, min = "", max = "") {
    return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" inputmode="decimal" placeholder="${placeholder}" step="${step}" min="${min}" max="${max}"></div>`;
  }

  function currentFormValues() {
    return {
      date: localKey(),
      weight: $("#weight")?.value.trim() || "",
      reach: $("#reach")?.value.trim() || "",
      sleep: $("#sleep")?.value.trim() || "",
      knee: $("#knee")?.value.trim() || "",
      energy: $("#energy")?.value.trim() || "",
      soreness: $("#soreness")?.value.trim() || "",
      notes: $("#notes")?.value.trim() || ""
    };
  }

  function populateForm() {
    const saved = state.checkins[localKey()];
    if (!saved) return;
    ["weight", "reach", "sleep", "knee", "energy", "soreness", "notes"].forEach((id) => {
      const el = $(`#${id}`);
      if (el) el.value = saved[id] ?? "";
    });
  }

  function saveCheckin() {
    const values = currentFormValues();
    state.checkins[localKey()] = values;
    setJSON(STORE.checkins, state.checkins);
    renderToday();
  }

  function clearTodayForm() {
    delete state.checkins[localKey()];
    setJSON(STORE.checkins, state.checkins);
    renderToday();
  }

  function readinessFrom(checkin) {
    const knee = clamp(checkin?.knee ?? 0, 0, 10);
    const sleep = Number(checkin?.sleep || 0);
    const soreness = clamp(checkin?.soreness ?? 0, 0, 10);
    const energy = clamp(checkin?.energy ?? 7, 0, 10);

    if (knee >= 4) return ["red", "🔴", "Recovery-only", "Knee pain is high. Replace lower-body jumps with walking, bike, mobility, and consider a physio check if it repeats."];
    if (sleep > 0 && sleep < 5) return ["red", "🔴", "No max jumping", "Sleep is too low for explosive work. Do the minimum, eat, and protect tonight."];
    if (soreness >= 8) return ["red", "🔴", "Deload today", "Soreness is too high. Cut volume and avoid depth jumps or max contacts."];
    if ((sleep > 0 && sleep < 6) || soreness >= 6 || energy <= 4 || knee >= 3) return ["amber", "🟡", "Modified session", "Keep technique and strength, but reduce jump contacts and stop before fatigue changes movement."];
    return ["green", "🟢", "Ready", "Run the planned session. Keep jumps high quality and leave a little in the tank."];
  }

  function renderReadiness() {
    const live = currentFormValues();
    const saved = state.checkins[localKey()] || live;
    const [level, icon, title, copy] = readinessFrom(saved);
    const box = $("#readinessBox");
    if (!box) return;
    box.innerHTML = `
      <article class="readiness readiness--${level}" aria-live="polite">
        <div class="readiness__badge" aria-hidden="true">${icon}</div>
        <div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(copy)}</p></div>
      </article>
    `;
  }

  function renderTraining() {
    const day = WEEK[state.dayIndex];
    const tabs = WEEK.map((item, index) => `<button class="tab" type="button" aria-selected="${state.dayIndex === index}" data-day="${index}">${item.day}</button>`).join("");
    $("#panel-training").innerHTML = `
      <div class="stack">
        <section class="command-card">
          <div class="command-card__inner">
            <p class="kicker">Training board</p>
            <h2 class="hero-title">${escapeHTML(day.day)} · ${escapeHTML(day.theme)}</h2>
            <p class="hero-copy">Choose the day, execute the session, then obey the readiness filter. Jump quality is the KPI.</p>
          </div>
        </section>
        <div class="tabs" role="tablist" aria-label="Training days">${tabs}</div>
        ${session(day.am, "am")}
        ${session(day.pm, "pm")}
        <article class="card card--lime"><p class="section-kicker">Coach note</p><h3>${escapeHTML(day.note)}</h3></article>
      </div>
    `;
  }

  function session(block, type) {
    const [title, items] = block;
    return `
      <section class="workout-card ${type === "pm" ? "workout-card--pm" : ""}">
        <span class="pill ${type === "pm" ? "pill--sky" : "pill--lime"}">${type === "am" ? "☀️ AM" : "🌙 PM"}</span>
        <h3>${escapeHTML(title)}</h3>
        <ul class="clean">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
      </section>
    `;
  }

  function renderMeals() {
    const meal = MEALS[state.mealType];
    const toggles = Object.entries(MEALS).map(([key, value]) => `<button class="toggle" type="button" aria-pressed="${state.mealType === key}" data-meal="${key}">${escapeHTML(value.title)}</button>`).join("");
    $("#panel-meals").innerHTML = `
      <div class="stack">
        <section class="command-card">
          <div class="command-card__inner">
            <p class="kicker">Nutrition cockpit</p>
            <h2 class="hero-title">${escapeHTML(meal.headline)}</h2>
            <p class="hero-copy">Performance cut: repeatable meals, high protein, carbs placed where they help jumps, no crash diet heroics.</p>
          </div>
        </section>
        <div class="toggle-row">${toggles}</div>
        <article class="card">
          <p class="section-kicker">Target range</p>
          <div class="macro-grid">
            ${metric(meal.target.kcal, "calories")}
            ${metric(meal.target.protein, "protein")}
            ${metric(meal.target.carbs, "carbs")}
            ${metric(meal.target.fat, "fat")}
          </div>
        </article>
        <section aria-label="Meal structure">
          ${meal.meals.map(([time, name, items], index) => mealCard(time, name, items, index === 0)).join("")}
        </section>
      </div>
    `;
  }

  function mealCard(time, name, items, open) {
    return `
      <details class="meal-card" ${open ? "open" : ""}>
        <summary><div class="meal-title"><span class="meal-time">${escapeHTML(time)}</span><strong>${escapeHTML(name)}</strong></div><span aria-hidden="true">⌄</span></summary>
        <div class="meal-body"><ul class="clean">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
      </details>
    `;
  }

  function renderRecovery() {
    $("#panel-recovery").innerHTML = `
      <div class="stack">
        <section class="command-card"><div class="command-card__inner"><p class="kicker">Recovery shield</p><h2 class="hero-title">Protect the spring.</h2><p class="hero-copy">The goal is not to prove toughness. The goal is to arrive at the rim with healthy knees and elastic legs.</p></div></section>
        <div class="grid grid--two">
          ${RECOVERY.map(([title, copy]) => `<article class="card"><p class="section-kicker">Rule</p><h3>${escapeHTML(title)}</h3><p>${escapeHTML(copy)}</p></article>`).join("")}
        </div>
      </div>
    `;
  }

  function renderMind() {
    $("#panel-mind").innerHTML = `
      <div class="stack">
        <section class="command-card"><div class="command-card__inner"><p class="kicker">Mental OS</p><h2 class="hero-title">One clean block.</h2><p class="hero-copy">Keep the mind work small enough to do daily. One finished hour beats a dramatic plan you skip.</p></div></section>
        <article class="card card--lime"><p class="section-kicker">Learning menu</p><div class="chips">${MIND.learning.map(([title]) => `<span class="chip">${escapeHTML(title)}</span>`).join("")}</div></article>
        <div class="grid grid--two">
          ${[...MIND.learning, ...MIND.deep].map(([title, copy]) => `<article class="card"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(copy)}</p></article>`).join("")}
        </div>
      </div>
    `;
  }

  function renderProgress() {
    const rows = Object.values(state.checkins).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 21);
    const summary = progressSummary(rows);
    $("#panel-progress").innerHTML = `
      <div class="stack">
        <section class="command-card"><div class="command-card__inner"><p class="kicker">Progress room</p><h2 class="hero-title">Measure signals.</h2><p class="hero-copy">Logs stay on this device. Export before reinstalling or clearing browser data.</p></div></section>
        <div class="grid grid--three">
          <article class="card card--lime"><p class="section-kicker">Logs</p><h3>${rows.length}</h3><p>latest saved check-ins</p></article>
          <article class="card"><p class="section-kicker">Avg sleep</p><h3>${escapeHTML(summary.avgSleep)}</h3><p>from visible logs</p></article>
          <article class="card card--sky"><p class="section-kicker">Best touch</p><h3>${escapeHTML(summary.bestTouch)}</h3><p>highest logged reach</p></article>
        </div>
        <article class="card">
          <p class="section-kicker">Data controls</p>
          <p>Your logs stay in this browser's local storage.</p>
          <div class="action-row">
            <button class="primary" type="button" data-action="export-data">Export JSON</button>
            <button class="danger" type="button" data-action="reset-data">Reset logs</button>
          </div>
        </article>
        <article class="card">
          <p class="section-kicker">Latest check-ins</p>
          <div class="log-list">${rows.length ? rows.map(logRow).join("") : `<p class="small">No check-ins saved yet. Save today's check-in from the Today tab.</p>`}</div>
        </article>
      </div>
    `;
  }

  function progressSummary(rows) {
    const sleepValues = rows.map((row) => Number(row.sleep)).filter((n) => Number.isFinite(n) && n > 0);
    const reachValues = rows.map((row) => Number(row.reach)).filter((n) => Number.isFinite(n) && n > 0);
    const avgSleep = sleepValues.length ? `${(sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length).toFixed(1)}h` : "--";
    const bestTouch = reachValues.length ? `${Math.max(...reachValues)}cm` : "--";
    return { avgSleep, bestTouch };
  }

  function logRow(row) {
    const bits = [
      row.weight ? `weight ${row.weight}kg` : "",
      row.reach ? `touch ${row.reach}cm` : "",
      row.sleep ? `sleep ${row.sleep}h` : "",
      row.knee ? `knee ${row.knee}/10` : "",
      row.soreness ? `soreness ${row.soreness}/10` : "",
      row.energy ? `energy ${row.energy}/10` : ""
    ].filter(Boolean).join(" · ");
    return `<div class="log-row"><strong>${escapeHTML(row.date)}</strong><span>${escapeHTML(bits || "No metrics")}</span>${row.notes ? `<span>${escapeHTML(row.notes)}</span>` : ""}</div>`;
  }

  function renderSafety() {
    $("#panel-safety").innerHTML = `
      <div class="stack">
        <section class="command-card"><div class="command-card__inner"><p class="kicker">Safety gate</p><h2 class="hero-title">Do not obey bad orders.</h2><p class="hero-copy">The app should help you train. It should never pressure you into unsafe drugs, reckless cutting, or injury volume.</p></div></section>
        <article class="card card--red"><p class="section-kicker">Important change</p><h3>Unsafe dosing instructions were removed.</h3><p>The protocol keeps training, nutrition, recovery, and doctor-approved judgment. It does not give peptide/SARM-style dosing or medical permission.</p></article>
        <div class="grid grid--two">
          ${SAFETY.map(([title, copy]) => `<article class="card"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(copy)}</p></article>`).join("")}
        </div>
      </div>
    `;
  }

  function exportData() {
    const payload = {
      app: "Breakthrough 65 — Athlete OS",
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      checkins: state.checkins,
      todayRules: state.rules
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `breakthrough-export-${localKey()}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function resetData() {
    const ok = window.confirm("Reset all Breakthrough check-in logs on this device?");
    if (!ok) return;
    state.checkins = {};
    setJSON(STORE.checkins, state.checkins);
    renderAll();
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-nav]");
      if (nav) {
        state.nav = nav.dataset.nav;
        renderNav();
        renderActivePanel();
        $("#app")?.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const rule = event.target.closest("[data-rule]");
      if (rule) {
        const key = rule.dataset.rule;
        state.rules[key] = !state.rules[key];
        setJSON(STORE.rulesPrefix + localKey(), state.rules);
        renderToday();
        return;
      }

      const day = event.target.closest("[data-day]");
      if (day) {
        state.dayIndex = Number(day.dataset.day);
        renderTraining();
        return;
      }

      const meal = event.target.closest("[data-meal]");
      if (meal) {
        state.mealType = meal.dataset.meal;
        renderMeals();
        return;
      }

      const action = event.target.closest("[data-action]");
      if (action) {
        const type = action.dataset.action;
        if (type === "save-checkin") saveCheckin();
        if (type === "clear-today") clearTodayForm();
        if (type === "export-data") exportData();
        if (type === "reset-data") resetData();
      }
    });

    document.addEventListener("input", (event) => {
      if (["knee", "sleep", "soreness", "energy"].includes(event.target.id)) renderReadiness();
    });

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      state.installPrompt = event;
      $("#installBanner").hidden = false;
    });

    $("#installButton")?.addEventListener("click", async () => {
      if (!state.installPrompt) return;
      state.installPrompt.prompt();
      await state.installPrompt.userChoice.catch(() => null);
      state.installPrompt = null;
      $("#installBanner").hidden = true;
    });
  }

  function renderActivePanel() {
    const renderers = {
      today: renderToday,
      training: renderTraining,
      meals: renderMeals,
      recovery: renderRecovery,
      mind: renderMind,
      progress: renderProgress,
      safety: renderSafety
    };
    renderers[state.nav]?.();
  }

  function renderAll() {
    updateTopbar();
    renderNav();
    renderToday();
    renderTraining();
    renderMeals();
    renderRecovery();
    renderMind();
    renderProgress();
    renderSafety();
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => null);
    });
  }

  updateTopbar();
  bindEvents();
  renderAll();
  registerServiceWorker();
  window.setInterval(updateTopbar, 60_000);
})();
