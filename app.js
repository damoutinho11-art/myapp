(() => {
  "use strict";

  const APP_VERSION = "4.1.0-release-polish";
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
      badge: "🏋️ Exact training fuel",
      headline: "Exact meals. No guessing.",
      target: { kcal: "1,616", protein: "204g", carbs: "64g", fat: "39g" },
      rule: "Use this on heavy lifting, lower-body, jump, or basketball days. Keep the rice exactly to 40g dry weight unless you intentionally refeed.",
      meals: [
        { time: "07:30", name: "Egg Breakfast", kcal: 491, p: 58, c: 13, f: 23, items: ["4 whole eggs — 236 kcal", "200g Greek yogurt 2.5% — 128 kcal", "1 scoop whey protein — 119 kcal", "10g ketchup — 8 kcal"], tip: "Tracker-verified. Scramble eggs, mix whey into yogurt, ketchup on eggs." },
        { time: "12:30", name: "Chicken & Veg Lunch", kcal: 355, p: 49, c: 8, f: 5, items: ["200g chicken breast, cooked — 261 kcal", "200g frozen veg mix — 94 kcal", "Ketchup to taste"], tip: "Batch cook 3 days at a time. Keep the chicken entry consistent: cooked weight in this app." },
        { time: "15:30", name: "Pre-Workout Tuna", kcal: 145, p: 30, c: 0, f: 2, items: ["2 tins tuna, 120g each — 145 kcal", "Ketchup"], tip: "Closes the protein gap. Eat about 60 minutes before training." },
        { time: "18:30", name: "Post-Workout Chicken & Rice", kcal: 455, p: 43, c: 38, f: 4, items: ["150g chicken breast, cooked — 196 kcal", "40g rice, dry weight — 134 kcal", "200g frozen veg mix — 94 kcal", "Ketchup"], tip: "Your main carb hit of the day. Keep rice to 40g dry weight." },
        { time: "21:00", name: "Night Casein", kcal: 170, p: 24, c: 5, f: 5, items: ["200g light cottage cheese 3% — 170 kcal"], tip: "Every night. Prepare it before bed so the plan survives tired evenings." }
      ]
    },

    lower: {
      title: "Lower high-carb",
      badge: "🚀 Exact lower-body fuel",
      headline: "More carbs for jump days.",
      target: { kcal: "1,855", protein: "208g", carbs: "121g", fat: "39g" },
      rule: "Use this on hard lower-body, approach-jump, basketball, or testing days when jump quality matters more than aggressive cutting.",
      meals: [
        { time: "07:30", name: "Egg Breakfast", kcal: 491, p: 58, c: 13, f: 23, items: ["4 whole eggs — 236 kcal", "200g Greek yogurt 2.5% — 128 kcal", "1 scoop whey protein — 119 kcal", "10g ketchup — 8 kcal"], tip: "Same base as the normal training day. Do not skip breakfast on max jump days." },
        { time: "12:30", name: "Chicken & Veg Lunch", kcal: 355, p: 49, c: 8, f: 5, items: ["200g chicken breast, cooked — 261 kcal", "200g frozen veg mix — 94 kcal", "Ketchup to taste"], tip: "Keep this clean so the extra carbs stay around training." },
        { time: "15:30", name: "Pre-Workout Tuna + Banana", kcal: 250, p: 31, c: 27, f: 2, items: ["2 tins tuna, 120g each — 145 kcal", "1 medium banana — 105 kcal", "Ketchup"], tip: "Use 45–75 minutes before jumping. This is the small performance boost meal." },
        { time: "18:30", name: "Post-Workout Chicken & Double Rice", kcal: 589, p: 46, c: 68, f: 4, items: ["150g chicken breast, cooked — 196 kcal", "80g rice, dry weight — 268 kcal", "200g frozen veg mix — 94 kcal", "Ketchup"], tip: "Double rice only on the days that actually need it. Log jump quality after." },
        { time: "21:00", name: "Night Casein", kcal: 170, p: 24, c: 5, f: 5, items: ["200g light cottage cheese 3% — 170 kcal"], tip: "Every night. Prepare it before bed so the plan survives tired evenings." }
      ]
    },
    rest: {
      title: "Rest day",
      badge: "😴 Exact rest cut",
      headline: "Lower carbs. Protein stays high.",
      target: { kcal: "1,323", protein: "187g", carbs: "21g", fat: "34g" },
      rule: "Use this on full rest or recovery-only days. No rice, no wrap, no accidental snack creep.",
      meals: [
        { time: "07:30", name: "Egg Breakfast", kcal: 363, p: 47, c: 2, f: 18, items: ["4 whole eggs — 236 kcal", "1 scoop whey protein — 119 kcal", "10g ketchup — 8 kcal"], tip: "No yogurt on rest days — saves 128 kcal." },
        { time: "12:00", name: "Chicken & Veg", kcal: 290, p: 37, c: 6, f: 4, items: ["150g chicken breast, cooked — 196 kcal", "200g frozen veg mix — 94 kcal", "Ketchup"], tip: "Smaller chicken portion today. No rice." },
        { time: "15:00", name: "Tuna Hit", kcal: 145, p: 30, c: 0, f: 2, items: ["2 tins tuna — 145 kcal", "Ketchup"], tip: "Pure protein bridge. Use it to kill rest-day hunger." },
        { time: "18:30", name: "Chicken & Veg Dinner", kcal: 355, p: 49, c: 8, f: 5, items: ["200g chicken breast, cooked — 261 kcal", "200g frozen veg mix — 94 kcal", "Ketchup"], tip: "Biggest meal of the rest day. No rice tonight." },
        { time: "21:00", name: "Night Casein", kcal: 170, p: 24, c: 5, f: 5, items: ["200g light cottage cheese 3% — 170 kcal"], tip: "Always. Every night." }
      ]
    },
    wrap: {
      title: "Wrap day",
      badge: "🌯 Exact wrap day",
      headline: "Portable version. Still exact.",
      target: { kcal: "1,660", protein: "227g", carbs: "60g", fat: "46g" },
      rule: "Use this when rice is not practical or you want variety. The wrap replaces the rice carb hit.",
      meals: [
        { time: "07:30", name: "Egg Breakfast", kcal: 491, p: 58, c: 13, f: 23, items: ["4 whole eggs — 236 kcal", "200g Greek yogurt 2.5% — 128 kcal", "1 scoop whey — 119 kcal", "10g ketchup — 8 kcal"], tip: "Same as training day. Full breakfast." },
        { time: "12:30", name: "Tuna Wrap Lunch", kcal: 383, p: 47, c: 30, f: 8, items: ["2 tins tuna — 145 kcal", "1 protein wrap, 80g — 234 kcal", "Ketchup — 4 kcal"], tip: "Wrap replaces rice today. No cheese — too many calories." },
        { time: "15:30", name: "Pre-Workout Chicken", kcal: 261, p: 49, c: 4, f: 5, items: ["200g chicken breast, cooked — 261 kcal", "Ketchup"], tip: "No extra carbs needed — wrap at lunch covered it." },
        { time: "18:30", name: "Post-Workout Chicken & Veg", kcal: 355, p: 49, c: 8, f: 5, items: ["200g chicken breast, cooked — 261 kcal", "200g frozen veg — 94 kcal", "Ketchup"], tip: "No rice tonight — wrap was your carb hit." },
        { time: "21:00", name: "Night Casein", kcal: 170, p: 24, c: 5, f: 5, items: ["200g light cottage cheese 3% — 170 kcal"], tip: "Every night. Always." }
      ]
    }
  };

  const MEAL_STAPLES = [
    ["Protein", ["Chicken breast", "Eggs", "Tuna", "Greek yogurt 2.5%", "Whey protein", "Light cottage cheese 3%"]],
    ["Carbs", ["40g dry rice on training day", "80g protein wrap on wrap day", "Frozen veg mix", "Greek yogurt carbs count too"]],
    ["Rules", ["Protein stays high every day", "Training day gets rice", "Rest day gets no rice/wrap", "Use the same food tracker entries every time"]]
  ];



  const PREP_GUIDES = {
    train: ["3 training days: 12 eggs", "600g Greek yogurt 2.5%", "3 scoops whey", "1,050g cooked chicken breast", "6 tins tuna", "120g dry rice", "1,200g frozen veg", "600g light cottage cheese 3%", "Ketchup"],
    lower: ["3 lower/jump days: 12 eggs", "600g Greek yogurt 2.5%", "3 scoops whey", "1,050g cooked chicken breast", "6 tins tuna", "3 bananas", "240g dry rice", "1,200g frozen veg", "600g light cottage cheese 3%", "Ketchup"],
    rest: ["3 rest days: 12 eggs", "3 scoops whey", "1,050g cooked chicken breast", "6 tins tuna", "1,200g frozen veg", "600g light cottage cheese 3%", "Ketchup"],
    wrap: ["3 wrap days: 12 eggs", "600g Greek yogurt 2.5%", "3 scoops whey", "6 tins tuna", "3 protein wraps, 80g each", "1,200g cooked chicken breast", "600g frozen veg", "600g light cottage cheese 3%", "Ketchup"]
  };

  const EMERGENCY_RULES = [
    ["No-cook rescue", "2 tins tuna + 1 protein wrap + cottage cheese. Not perfect, but it protects protein without ordering junk."],
    ["Rehearsal day", "Pack tuna, wrap, banana, whey shaker, and cottage cheese before leaving home."],
    ["Low appetite", "Finish protein first, then rice/banana if it is a jump day."],
    ["Hunger spike", "Drink water, eat frozen veg/chicken, then reassess after 20 minutes. Do not snack randomly."],
  ];

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
    rulesPrefix: "breakthrough.rules.",
    legacyRulesPrefix: "breakthrough.rules.v3.",
    checkins: "breakthrough.checkins",
    legacyCheckinsV3: "breakthrough.checkins.v3",
    legacyCheckinsV2: "breakthrough.checkins.v2",
    mealLogsPrefix: "breakthrough.meals."
  };

  const state = {
    nav: "today",
    dayIndex: todayWeekIndex(),
    mealType: "train",
    rules: getJSON(STORE.rulesPrefix + localKey(), getJSON(STORE.legacyRulesPrefix + localKey(), {})),
    checkins: getJSON(STORE.checkins, getJSON(STORE.legacyCheckinsV3, getJSON(STORE.legacyCheckinsV2, {}))),
    mealLogs: getJSON(STORE.mealLogsPrefix + localKey(), {}),
    installPrompt: null,
    waitingWorker: null
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
                <p class="kicker">Athlete command center · v4.1</p>
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
        <div id="governorBox"></div>
        ${todayMealSnapshot()}

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
    renderGovernor();
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



  function recentCheckins(limit = 7) {
    return Object.values(state.checkins).filter(Boolean).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, limit);
  }

  function trendWarning() {
    const rows = recentCheckins(10).slice().reverse();
    const weights = rows.map((row) => ({ date: row.date, weight: Number(row.weight) })).filter((row) => Number.isFinite(row.weight) && row.weight > 0);
    const sleeps = rows.map((row) => Number(row.sleep)).filter((n) => Number.isFinite(n) && n > 0);
    const knees = rows.map((row) => Number(row.knee)).filter((n) => Number.isFinite(n));
    const soreness = rows.map((row) => Number(row.soreness)).filter((n) => Number.isFinite(n));

    const warnings = [];
    if (weights.length >= 2) {
      const first = weights[0].weight;
      const last = weights[weights.length - 1].weight;
      const drop = first - last;
      const pct = first ? (drop / first) * 100 : 0;
      if (pct > 1.25) warnings.push(["Cut speed", `Weight is down ${pct.toFixed(1)}% across recent logs. Raise food or reduce fatigue if jump quality drops.`]);
    }
    if (sleeps.length >= 3) {
      const avgSleep = sleeps.reduce((a, b) => a + b, 0) / sleeps.length;
      if (avgSleep < 6) warnings.push(["Sleep debt", `Recent average sleep is ${avgSleep.toFixed(1)}h. Remove max jumps until sleep is back above 6h.`]);
    }
    if (knees.filter((n) => n >= 4).length >= 2) warnings.push(["Knee trend", "Knee pain has hit 4/10+ more than once. Swap plyos for recovery and get assessed if it repeats."]);
    if (soreness.filter((n) => n >= 8).length >= 2) warnings.push(["Soreness trend", "High soreness is repeating. Deload lower-body volume before it becomes an injury problem."]);
    return warnings;
  }

  function renderGovernor() {
    const warnings = trendWarning();
    const box = $("#governorBox");
    if (!box) return;
    const good = !warnings.length;
    box.innerHTML = `
      <article class="governor ${good ? "governor--green" : "governor--amber"}">
        <p class="section-kicker">Cut safety governor</p>
        <h3>${good ? "Trend check is clean" : "Adjust before forcing more volume"}</h3>
        ${good ? `<p>No recent red trend from logged weight, sleep, knees, or soreness. Keep logging honestly.</p>` : `<ul class="clean">${warnings.map(([title, copy]) => `<li><strong>${escapeHTML(title)}:</strong> ${escapeHTML(copy)}</li>`).join("")}</ul>`}
      </article>
    `;
  }

  function todayMealSnapshot() {
    const meal = MEALS[state.mealType];
    const done = completedMealsFor(state.mealType);
    const totals = completedMacroTotals(meal, done);
    return `
      <article class="card card--sky">
        <p class="section-kicker">Today fuel</p>
        <h3>${done.size}/${meal.meals.length} meals complete · ${escapeHTML(meal.title)}</h3>
        <p>${totals.kcal} / ${escapeHTML(meal.target.kcal)} kcal · ${totals.p}g / ${escapeHTML(meal.target.protein)} protein</p>
      </article>
    `;
  }

  function completedMealsFor(type = state.mealType) {
    return new Set((state.mealLogs[type] || []).map((idx) => Number(idx)));
  }

  function completedMacroTotals(meal, doneSet) {
    return meal.meals.reduce((acc, item, index) => {
      if (!doneSet.has(index)) return acc;
      acc.kcal += Number(item.kcal) || 0;
      acc.p += Number(item.p) || 0;
      acc.c += Number(item.c) || 0;
      acc.f += Number(item.f) || 0;
      return acc;
    }, { kcal: 0, p: 0, c: 0, f: 0 });
  }

  function saveMealLogs() {
    setJSON(STORE.mealLogsPrefix + localKey(), state.mealLogs);
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
    const done = completedMealsFor();
    const totals = completedMacroTotals(meal, done);
    const percent = Math.round((done.size / meal.meals.length) * 100);
    $("#panel-meals").innerHTML = `
      <div class="stack">
        <section class="command-card">
          <div class="command-card__inner">
            <p class="kicker">Nutrition cockpit · ${escapeHTML(meal.badge)}</p>
            <h2 class="hero-title">${escapeHTML(meal.headline)}</h2>
            <p class="hero-copy">Exact foods, exact portions, exact macros — now with meal checkoffs, grocery prep, and safer lower-body fueling.</p>
          </div>
        </section>
        <div class="toggle-row">${toggles}</div>
        <article class="card card--lime">
          <p class="section-kicker">Exact daily total</p>
          <div class="macro-grid">
            ${metric(meal.target.kcal, "calories")}
            ${metric(meal.target.protein, "protein")}
            ${metric(meal.target.carbs, "carbs")}
            ${metric(meal.target.fat, "fat")}
          </div>
          <p class="exact-note">${escapeHTML(meal.rule)}</p>
        </article>
        <article class="card">
          <p class="section-kicker">Meal completion</p>
          <h3>${done.size}/${meal.meals.length} complete · ${percent}%</h3>
          <div class="meal-progress" aria-label="Meal completion ${percent}%"><span style="width:${percent}%"></span></div>
          <p>${totals.kcal} kcal · ${totals.p}g protein · ${totals.c}g carbs · ${totals.f}g fat logged from completed meals.</p>
          <div class="action-row"><button class="secondary" type="button" data-action="clear-meals">Clear meal checkoffs</button></div>
        </article>
        <section aria-label="Exact meal structure">
          ${meal.meals.map((item, index) => mealCard(item, index === 0, done.has(index), index)).join("")}
        </section>
        <section class="grid grid--two" aria-label="Grocery and emergency prep">
          <article class="card card--sky"><p class="section-kicker">3-day grocery prep</p><h3>${escapeHTML(meal.title)}</h3><ul class="clean">${(PREP_GUIDES[state.mealType] || []).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></article>
          <article class="card"><p class="section-kicker">Emergency rules</p><h3>Protect the plan when life gets messy.</h3><ul class="clean">${EMERGENCY_RULES.map(([title, copy]) => `<li><strong>${escapeHTML(title)}:</strong> ${escapeHTML(copy)}</li>`).join("")}</ul></article>
        </section>
        <section class="grid grid--three" aria-label="Staples and rules">
          ${MEAL_STAPLES.map(([title, items]) => `<article class="card"><p class="section-kicker">Staples</p><h3>${escapeHTML(title)}</h3><ul class="clean">${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></article>`).join("")}
        </section>
        <article class="card card--dark">
          <p class="section-kicker">Adjustment rule</p>
          <h3>Do not freestyle the meals during the cut.</h3>
          <p>If scale trend drops too fast, sleep collapses, or jump performance tanks, use the lower high-carb day or deliberately raise food. Do not solve it with random snacks.</p>
        </article>
      </div>
    `;
  }

  function mealCard(meal, open, done, index) {
    const stats = [
      [meal.kcal, "kcal"],
      [meal.p, "P"],
      [meal.c, "C"],
      [meal.f, "F"]
    ].map(([value, label]) => `<span class="meal-stat"><strong>${escapeHTML(value)}</strong><em>${escapeHTML(label)}</em></span>`).join("");
    return `
      <details class="meal-card ${done ? "is-done" : ""}" ${open ? "open" : ""}>
        <summary>
          <div class="meal-title">
            <span class="meal-time">${escapeHTML(meal.time)}</span>
            <strong>${escapeHTML(meal.name)}</strong>
          </div>
          <div class="meal-stats">${stats}</div>
        </summary>
        <div class="meal-body">
          <button class="check-row ${done ? "is-done" : ""}" type="button" aria-pressed="${done}" data-meal-check="${index}">
            <span class="checkbox" aria-hidden="true"></span>
            <span class="rule-row__icon" aria-hidden="true">${done ? "✅" : "🍽️"}</span>
            <span><span class="rule-title">${done ? "Meal complete" : "Mark meal complete"}</span><span class="rule-sub">Updates today's meal totals on this device.</span></span>
          </button>
          <ul class="clean">${meal.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          <p class="meal-tip">${escapeHTML(meal.tip)}</p>
        </div>
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
          <p>Your logs stay in this browser's local storage. Export before changing phones. Import restores check-ins and meal checkoffs.</p>
          <div class="action-row">
            <button class="primary" type="button" data-action="export-data">Export JSON</button>
            <button class="secondary" type="button" data-action="pick-import">Import JSON</button>
            <button class="danger" type="button" data-action="reset-data">Reset logs</button>
          </div>
          <input id="importFile" type="file" accept="application/json,.json" hidden>
        </article>
        <article class="card card--sky">
          <p class="section-kicker">Trend warnings</p>
          ${trendWarning().length ? `<ul class="clean">${trendWarning().map(([title, copy]) => `<li><strong>${escapeHTML(title)}:</strong> ${escapeHTML(copy)}</li>`).join("")}</ul>` : `<h3>No red trend from recent logs.</h3><p>Keep logging weight, sleep, knees, soreness, and touch height honestly.</p>`}
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
        <article class="card card--sky"><p class="section-kicker">App version</p><h3>${escapeHTML(APP_VERSION)}</h3><p>Use this when checking whether GitHub Pages and the PWA cache updated correctly.</p><div class="action-row"><button class="secondary" type="button" data-action="check-update">Check for update</button><button class="primary" type="button" data-action="reload-app">Reload app</button></div></article>
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
      mealLogs: state.mealLogs,
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


  function importDataFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        const importedCheckins = payload.checkins && typeof payload.checkins === "object" ? payload.checkins : null;
        const importedMealLogs = payload.mealLogs && typeof payload.mealLogs === "object" ? payload.mealLogs : null;
        if (!importedCheckins && !importedMealLogs) throw new Error("No importable data found.");
        if (importedCheckins) state.checkins = { ...state.checkins, ...importedCheckins };
        if (importedMealLogs) state.mealLogs = { ...state.mealLogs, ...importedMealLogs };
        setJSON(STORE.checkins, state.checkins);
        saveMealLogs();
        window.alert("Import complete. Check-ins and meal checkoffs were merged into this device.");
        renderAll();
      } catch (error) {
        window.alert(`Import failed: ${error.message}`);
      }
    });
    reader.readAsText(file);
  }

  async function checkForUpdate() {
    if (!("serviceWorker" in navigator)) {
      window.alert("Service worker updates are not available in this browser.");
      return;
    }
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      window.alert("No service worker is registered yet. Reload once, then check again.");
      return;
    }
    await registration.update();
    window.alert("Update check finished. If a new version is available, reload the app.");
  }

  function showUpdateBanner() {
    const banner = $("#updateBanner");
    if (banner) banner.hidden = false;
  }

  function resetData() {
    const ok = window.confirm("Reset all Breakthrough check-in logs and meal checkoffs on this device?");
    if (!ok) return;
    state.checkins = {};
    state.mealLogs = {};
    setJSON(STORE.checkins, state.checkins);
    saveMealLogs();
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

      const mealCheck = event.target.closest("[data-meal-check]");
      if (mealCheck) {
        const index = Number(mealCheck.dataset.mealCheck);
        const done = completedMealsFor();
        if (done.has(index)) done.delete(index); else done.add(index);
        state.mealLogs[state.mealType] = Array.from(done).sort((a, b) => a - b);
        saveMealLogs();
        renderMeals();
        return;
      }

      const action = event.target.closest("[data-action]");
      if (action) {
        const type = action.dataset.action;
        if (type === "save-checkin") saveCheckin();
        if (type === "clear-today") clearTodayForm();
        if (type === "export-data") exportData();
        if (type === "pick-import") $("#importFile")?.click();
        if (type === "reset-data") resetData();
        if (type === "clear-meals") { state.mealLogs[state.mealType] = []; saveMealLogs(); renderMeals(); }
        if (type === "check-update") checkForUpdate();
        if (type === "reload-app") window.location.reload();
      }
    });

    document.addEventListener("input", (event) => {
      if (["knee", "sleep", "soreness", "energy"].includes(event.target.id)) renderReadiness();
    });

    document.addEventListener("change", (event) => {
      if (event.target.id === "importFile") {
        importDataFile(event.target.files?.[0]);
        event.target.value = "";
      }
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
      navigator.serviceWorker.register("./sw.js").then((registration) => {
        if (registration.waiting) {
          state.waitingWorker = registration.waiting;
          showUpdateBanner();
        }
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              state.waitingWorker = worker;
              showUpdateBanner();
            }
          });
        });
      }).catch(() => null);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      showUpdateBanner();
    });

    $("#reloadButton")?.addEventListener("click", () => {
      if (state.waitingWorker) state.waitingWorker.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    });
  }

  updateTopbar();
  bindEvents();
  renderAll();
  registerServiceWorker();
  window.setInterval(updateTopbar, 60_000);
})();
