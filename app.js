import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  initializeFirestore,
  doc,
  setDoc,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMfHilqsLgdwFcCTrtXhacnkhLqpWm60c",
  authDomain: "aws-exam-tracker.firebaseapp.com",
  projectId: "aws-exam-tracker",
  storageBucket: "aws-exam-tracker.firebasestorage.app",
  messagingSenderId: "884281667059",
  appId: "1:884281667059:web:1f09f986c8929d31a57686",
  measurementId: "G-E569L61F7H"
};

const EXAM_DATE = "2026-09-05";
const STORAGE_KEY = "aws-tracker-september-5-v1";
const DOC_ID = "september-5-2026";

const phase = (id, number, title, dates, promise, sessions) => ({ id, number, title, dates, promise, sessions });
const session = (date, title, detail, duration, type, domain = "general", scoreable = false) => ({ date, title, detail, duration, type, domain, scoreable });

const PHASES = [
  phase("topic", "01", "Topic-based tests", "Jul 18 — Jul 24", "Test one service at a time and expose the gaps before mixed practice.", [
    session("2026-07-18", "Topic-Based — IAM", "Complete the full IAM topic test", 60, "practice", "security", true),
    session("2026-07-18", "Topic-Based — EC2", "Complete the full EC2 topic test", 60, "practice", "performance", true),
    session("2026-07-19", "Topic-Based — VPC", "Complete the full VPC topic test", 60, "practice", "resilience", true),
    session("2026-07-19", "Topic-Based — S3", "Complete the full S3 topic test", 60, "practice", "cost", true),
    session("2026-07-20", "Topic-Based — EBS", "Complete the full EBS topic test", 60, "practice", "performance", true),
    session("2026-07-20", "Topic-Based — EFS", "Complete the full EFS topic test", 60, "practice", "performance", true),
    session("2026-07-21", "Topic-Based — RDS", "Complete the full RDS topic test", 60, "practice", "resilience", true),
    session("2026-07-21", "Topic-Based — DynamoDB", "Complete the full DynamoDB topic test", 60, "practice", "performance", true),
    session("2026-07-22", "Topic-Based — Auto Scaling", "Complete the full Auto Scaling topic test", 60, "practice", "resilience", true),
    session("2026-07-22", "Topic-Based — ELB", "Complete the full Elastic Load Balancing topic test", 60, "practice", "resilience", true),
    session("2026-07-23", "Topic-Based — CloudFront", "Complete the full CloudFront topic test", 60, "practice", "performance", true),
    session("2026-07-23", "Topic-Based — Lambda", "Complete the full Lambda topic test", 60, "practice", "cost", true),
    session("2026-07-24", "Topic-Based — SQS", "Complete the full SQS topic test", 60, "practice", "resilience", true)
  ]),
  phase("review-mode", "02", "Review Mode", "Jul 25 — Aug 2", "Complete every set untimed, reading every explanation as you go.", [
    session("2026-07-25", "Review Mode — Diagnostic Test", "Work through the diagnostic and read every explanation", 120, "practice", "general", true),
    session("2026-07-25", "Diagnostic wrong-answer review", "Revisit every miss and uncertain guess", 60, "review"),
    session("2026-07-26", "Review Mode — Set 1", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-07-26", "Set 1 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-07-27", "Review Mode — Set 2", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-07-27", "Set 2 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-07-28", "Review Mode — Set 3", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-07-28", "Set 3 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-07-29", "Review Mode — Set 4", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-07-29", "Set 4 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-07-30", "Review Mode — Set 5", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-07-30", "Set 5 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-07-31", "Review Mode — Set 6", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-07-31", "Set 6 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-08-01", "Review Mode — Set 7", "Untimed practice · read every explanation", 120, "practice", "general", true),
    session("2026-08-01", "Set 7 wrong-answer review", "Log the service and reason for every miss", 45, "review"),
    session("2026-08-02", "Bonus Review Mode — Set 8", "Untimed bonus set · read every explanation", 120, "practice", "general", true),
    session("2026-08-02", "Bonus Set 8 wrong-answer review", "Log the service and reason for every miss", 45, "review")
  ]),
  phase("timed-mode", "03", "Timed Mode", "Aug 3 — Aug 11", "Repeat the same test flow under real exam pressure: 65 questions in 130 minutes.", [
    session("2026-08-03", "Timed Mode — Diagnostic Test", "65 questions · 130 minutes · exam conditions", 130, "practice", "general", true),
    session("2026-08-03", "Timed diagnostic wrong-answer review", "Review misses after the timer is finished", 60, "review"),
    session("2026-08-04", "Timed Mode — Set 1", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-04", "Timed Set 1 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-05", "Timed Mode — Set 2", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-05", "Timed Set 2 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-06", "Timed Mode — Set 3", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-06", "Timed Set 3 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-07", "Timed Mode — Set 4", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-07", "Timed Set 4 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-08", "Timed Mode — Set 5", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-08", "Timed Set 5 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-09", "Timed Mode — Set 6", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-09", "Timed Set 6 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-10", "Timed Mode — Set 7", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-10", "Timed Set 7 wrong-answer review", "Review misses and low-confidence guesses", 60, "review"),
    session("2026-08-11", "Bonus Timed Mode — Set 8", "65 questions · 130 minutes", 130, "practice", "general", true),
    session("2026-08-11", "Bonus Timed Set 8 review", "Review misses and low-confidence guesses", 60, "review")
  ]),
  phase("section-tests", "04", "Section-based tests", "Aug 12 — Aug 15", "Finish with one dedicated test for each official exam domain.", [
    session("2026-08-12", "Section — Design Secure Architectures", "Complete the full security-domain test", 120, "practice", "security", true),
    session("2026-08-12", "Secure Architectures wrong-answer review", "Review every missed security scenario", 60, "review", "security"),
    session("2026-08-13", "Section — Design Resilient Architectures", "Complete the full resilience-domain test", 120, "practice", "resilience", true),
    session("2026-08-13", "Resilient Architectures wrong-answer review", "Review every missed resilience scenario", 60, "review", "resilience"),
    session("2026-08-14", "Section — Design High-Performing Architectures", "Complete the full performance-domain test", 120, "practice", "performance", true),
    session("2026-08-14", "High-Performing Architectures review", "Review every missed performance scenario", 60, "review", "performance"),
    session("2026-08-15", "Section — Design Cost-Optimized Architectures", "Complete the full cost-domain test", 120, "practice", "cost", true),
    session("2026-08-15", "Cost-Optimized Architectures review", "Review every missed cost scenario", 60, "review", "cost")
  ]),
  phase("consolidation", "05", "Consolidation & taper", "Aug 16 — Sep 5", "Cycle through flashcards, wrong answers and weak areas, then protect the final days.", [
    session("2026-08-16", "Flashcards — Part 1", "Full review of the first flashcard set", 90, "review"),
    session("2026-08-16", "Flashcards — Part 2", "Full review of the second flashcard set", 90, "review"),
    session("2026-08-17", "Wrong answers — topic tests", "Mega-review every missed topic-based question", 90, "review"),
    session("2026-08-17", "Wrong answers — Review Mode", "Mega-review every missed Review Mode question", 90, "review"),
    session("2026-08-18", "Wrong answers — Timed Mode", "Mega-review every missed timed question", 90, "review"),
    session("2026-08-18", "Wrong answers — section tests", "Mega-review every missed section question", 90, "review"),
    session("2026-08-19", "Section quick-pass — Secure + Resilient", "Rapid review of Domains 1 and 2", 90, "review", "security"),
    session("2026-08-20", "Section quick-pass — Performance + Cost", "Rapid review of Domains 3 and 4", 90, "review", "performance"),
    session("2026-08-21", "Weak-area drill — lowest services", "Target the services with the lowest scores", 90, "review"),
    session("2026-08-22", "Final timed test — benchmark #1", "65 questions · 130 minutes · exam conditions", 130, "practice", "general", true),
    session("2026-08-23", "Benchmark #1 wrong-answer review", "Resolve every miss and uncertain guess", 120, "review"),
    session("2026-08-24", "Weak-area drill — benchmark gaps", "Drill only the services flagged yesterday", 60, "review"),
    session("2026-08-25", "Flashcards — rapid-fire pass", "Both parts, keeping only cards still difficult", 60, "review"),
    session("2026-08-26", "Cheat-sheet pass", "Service comparisons, limits and exam keywords", 60, "review"),
    session("2026-08-27", "Section quick-pass — all domains", "One final structured pass through all four domains", 90, "review"),
    session("2026-08-28", "Weak-area drill — final gaps", "Close the last unresolved knowledge gaps", 90, "review"),
    session("2026-08-29", "Final timed test — benchmark #2", "65 questions · 130 minutes · final full simulation", 130, "practice", "general", true),
    session("2026-08-30", "Benchmark #2 wrong-answer review", "Final review of misses and low-confidence guesses", 120, "review"),
    session("2026-08-31", "Weak-area drill — final test flags", "Only topics flagged by the final simulation", 60, "review"),
    session("2026-09-01", "Flashcards — final rapid-fire", "Both parts once, without adding new material", 60, "review"),
    session("2026-09-02", "Last study day — cheat sheet", "Light review only; stop while confidence is high", 45, "review"),
    session("2026-09-03", "REST — no studying", "Protect sleep and let the material settle", 15, "rest"),
    session("2026-09-04", "REST — exam setup", "Confirm ID, route, check-in details and sleep early", 15, "rest"),
    session("2026-09-05", "AWS SAA-C03 exam", "Breathe, read the requirement twice, trust the process", 130, "exam")
  ])
];

const allSessions = PHASES.flatMap((p) => p.sessions.map((s, index) => ({ ...s, id: `${p.id}-${s.date}-${index}`, phaseId: p.id, phaseTitle: p.title })));
const studySessions = allSessions.filter((s) => s.type !== "rest" && s.type !== "exam");
const domainNames = { security: "Secure", resilience: "Resilient", performance: "High-performing", cost: "Cost-optimized" };
const LAST_STUDY_DATE = "2026-09-02";
const PROTECTED_DATES = new Set(["2026-09-03", "2026-09-04", EXAM_DATE]);
const modeLabels = {
  topic: "Topic tests",
  "review-mode": "Review Mode",
  "timed-mode": "Timed Mode",
  "section-tests": "Section tests",
  consolidation: "Final benchmarks"
};

let db;
let docRef;
let state = { items: {} };
let activeId = null;
let activeFilter = "all";
let unsubscribeSnapshot = null;
let isInitialLoad = true;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function localDateISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromISO(value) {
  return new Date(`${value}T12:00:00`);
}

function formatDate(value, options = { month: "short", day: "numeric" }) {
  return dateFromISO(value).toLocaleDateString("en-CA", options);
}

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function getItemState(id) {
  return state.items?.[id] || {};
}

function normaliseState(value) {
  return value && typeof value === "object" && value.items ? value : { items: {} };
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === "success" ? "✓" : "!"}</span><p>${message}</p><button type="button" aria-label="Dismiss">×</button>`;
  $("#toast-container").appendChild(toast);
  const dismiss = () => {
    toast.classList.add("leaving");
    window.setTimeout(() => toast.remove(), 220);
  };
  toast.querySelector("button").addEventListener("click", dismiss);
  window.setTimeout(dismiss, 3500);
}

function hideLoadingScreen() {
  $("#loading-screen")?.classList.add("hidden");
}

function setSyncStatus(mode, text) {
  const status = $("#sync-status");
  if (!status) return;
  status.className = `sync-status ${mode}`;
  status.querySelector(".status-text").textContent = text;
}

function fallbackToLocal(reason) {
  try {
    state = normaliseState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    state = { items: {} };
  }
  setSyncStatus("offline", "Saved on this device");
  render();
  hideLoadingScreen();
  isInitialLoad = false;
  if (reason) showToast("Cloud sync is unavailable. Your progress is still saved here.", "warning");
}

function setupConnectionState() {
  window.addEventListener("online", () => {
    setSyncStatus("syncing", "Reconnecting");
    if (!unsubscribeSnapshot) setupRealtimeSync();
  });
  window.addEventListener("offline", () => {
    setSyncStatus("offline", "Saved on this device");
    showToast("You are offline. Changes will stay on this device.", "warning");
  });
}

function setupRealtimeSync() {
  if (!db) return;
  docRef = doc(db, "trackers", DOC_ID);
  unsubscribeSnapshot = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      state = normaliseState(snapshot.data().state);
    } else {
      try {
        state = normaliseState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
      } catch {
        state = { items: {} };
      }
      saveStateFirestore();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSyncStatus(snapshot.metadata.hasPendingWrites ? "syncing" : "online", snapshot.metadata.hasPendingWrites ? "Saving changes" : "Progress synced");
    render();
    if (isInitialLoad) {
      hideLoadingScreen();
      isInitialLoad = false;
    }
  }, () => fallbackToLocal("sync-error"));
}

async function saveStateFirestore() {
  if (!docRef) return;
  try {
    setSyncStatus("syncing", "Saving changes");
    await setDoc(docRef, { state, examDate: EXAM_DATE, updatedAt: new Date().toISOString() }, { merge: true });
  } catch {
    setSyncStatus("offline", "Saved on this device");
  }
}

function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveStateFirestore();
  render();
  if (message) showToast(message);
}

function daysUntil(date) {
  const today = dateFromISO(localDateISO());
  return Math.ceil((dateFromISO(date) - today) / 86400000);
}

function addDaysISO(value, amount = 1) {
  const date = dateFromISO(value);
  date.setDate(date.getDate() + amount);
  return localDateISO(date);
}

function dailyStudyCapacity(value) {
  const day = dateFromISO(value).getDay();
  if (day === 0 || day === 6) return 270;
  if (day === 4 || day === 5) return 225;
  return 195;
}

function isSmartScheduleEnabled() {
  return state.settings?.smartSchedule !== false;
}

function getScheduledSessions(today = localDateISO()) {
  if (!isSmartScheduleEnabled()) {
    return allSessions.map((item) => ({ ...item, plannedDate: item.date, moved: false }));
  }

  const loadByDate = {};
  allSessions.forEach((item) => {
    const completedOn = getItemState(item.id).done ? getItemState(item.id).date : null;
    if (completedOn && completedOn >= today && completedOn <= LAST_STUDY_DATE) {
      loadByDate[completedOn] = (loadByDate[completedOn] || 0) + item.duration;
    }
  });
  let previousDate = today;

  return allSessions.map((item) => {
    const itemState = getItemState(item.id);
    if (itemState.done || item.type === "rest" || item.type === "exam") {
      return { ...item, plannedDate: item.date, moved: false };
    }

    let scheduledDate = item.date < today ? today : item.date;
    if (scheduledDate < previousDate) scheduledDate = previousDate;

    while (
      scheduledDate < LAST_STUDY_DATE &&
      (PROTECTED_DATES.has(scheduledDate) || ((loadByDate[scheduledDate] || 0) + item.duration > dailyStudyCapacity(scheduledDate)))
    ) {
      scheduledDate = addDaysISO(scheduledDate);
    }

    if (scheduledDate > LAST_STUDY_DATE) scheduledDate = LAST_STUDY_DATE;
    loadByDate[scheduledDate] = (loadByDate[scheduledDate] || 0) + item.duration;
    previousDate = scheduledDate;

    return { ...item, plannedDate: item.date, date: scheduledDate, moved: scheduledDate !== item.date };
  });
}

function progressFor(sessions) {
  const trackable = sessions.filter((s) => s.type !== "rest" && s.type !== "exam");
  const done = trackable.filter((s) => getItemState(s.id).done).length;
  return { done, total: trackable.length, pct: trackable.length ? Math.round((done / trackable.length) * 100) : 0 };
}

function phaseStatus(currentPhase, today) {
  const start = currentPhase.sessions[0].date;
  const end = currentPhase.sessions[currentPhase.sessions.length - 1].date;
  const progress = progressFor(currentPhase.sessions);
  if (progress.total && progress.done === progress.total) return "complete";
  if (today >= start && today <= end) return "current";
  if (today > end) return "behind";
  return "upcoming";
}

function typeLabel(type) {
  return { learn: "Learn", review: "Review", practice: "Practice", rest: "Rest", exam: "Exam" }[type] || type;
}

function taskMarkup(item, focus = false) {
  const itemState = getItemState(item.id);
  const done = Boolean(itemState.done);
  const score = itemState.score !== undefined && itemState.score !== "" ? `<span class="task-score">${itemState.score}%</span>` : "";
  const missed = Number(itemState.errorLog?.missed || 0);
  const missedBadge = missed > 0 ? `<span class="mistake-badge">${missed} missed</span>` : "";
  const movedLabel = item.moved ? `<span class="moved-date" title="Originally ${formatDate(item.plannedDate)}">↻ ${formatDate(item.date, { weekday: "short", month: "short", day: "numeric" })}</span>` : `<span>${formatDate(item.date, { weekday: "short", month: "short", day: "numeric" })}</span>`;
  return `
    <article class="task-row ${done ? "done" : ""} ${item.moved ? "rescheduled" : ""} ${focus ? "focus-task" : ""}" data-id="${item.id}">
      <button class="task-check" type="button" aria-label="${done ? "Mark incomplete" : "Complete"}: ${escapeHTML(item.title)}" data-check-id="${item.id}"><span>✓</span></button>
      <button class="task-content" type="button" data-open-id="${item.id}">
        <span class="task-topline"><span class="task-type ${item.type}">${typeLabel(item.type)}</span>${movedLabel}</span>
        <strong>${escapeHTML(item.title)}</strong>
        <small>${escapeHTML(item.detail)}</small>
      </button>
      <div class="task-tail">${missedBadge}${score}<span>${formatMinutes(item.duration)}</span><button type="button" data-open-id="${item.id}" aria-label="Open session details">↗</button></div>
    </article>`;
}

function renderFocus(today, scheduledSessions) {
  const todaySessions = scheduledSessions.filter((item) => item.date === today);
  const unfinishedToday = todaySessions.filter((item) => !getItemState(item.id).done);
  let focusItems = unfinishedToday;
  let title = "Today’s plan";

  if (!focusItems.length && todaySessions.length) {
    focusItems = todaySessions;
    title = "Today — complete";
  }
  if (!focusItems.length) {
    const nextDate = scheduledSessions.find((item) => item.date > today && !getItemState(item.id).done)?.date;
    focusItems = scheduledSessions.filter((item) => item.date === nextDate);
    title = nextDate ? `Up next · ${formatDate(nextDate, { weekday: "long", month: "long", day: "numeric" })}` : "Plan complete";
  }

  $("#focus-title").textContent = title;
  $("#focus-duration").textContent = focusItems.length ? `${focusItems.length} ${focusItems.length === 1 ? "session" : "sessions"} · ${formatMinutes(focusItems.reduce((sum, item) => sum + item.duration, 0))}` : "You’re ready";
  $("#focus-list").innerHTML = focusItems.length ? focusItems.map((item) => taskMarkup(item, true)).join("") : `<div class="empty-state"><strong>Every session is complete.</strong><p>Protect your sleep and take that confidence into exam day.</p></div>`;
}

function renderSchedule(today, scheduledSessions = getScheduledSessions(today)) {
  const container = $("#schedule-list");
  container.innerHTML = PHASES.map((currentPhase) => {
    const phaseSessions = scheduledSessions.filter((item) => item.phaseId === currentPhase.id);
    const status = phaseStatus({ ...currentPhase, sessions: phaseSessions }, today);
    const progress = progressFor(phaseSessions);
    const filteredSessions = phaseSessions.filter((item) => activeFilter === "all" || item.type === activeFilter);
    if (!filteredSessions.length) return "";
    const open = status === "current" || activeFilter !== "all";
    return `
      <details class="phase-card ${status}" ${open ? "open" : ""}>
        <summary>
          <span class="phase-number">${currentPhase.number}</span>
          <span class="phase-summary-copy"><small>${currentPhase.dates}</small><strong>${currentPhase.title}</strong><em>${currentPhase.promise}</em></span>
          <span class="phase-progress"><strong>${progress.pct}%</strong><span>${progress.done}/${progress.total}</span></span>
          <span class="phase-chevron">⌄</span>
        </summary>
        <div class="phase-body">${filteredSessions.map((item) => taskMarkup(item)).join("")}</div>
      </details>`;
  }).join("");
}

function renderCatchUp(today, scheduledSessions) {
  const enabled = isSmartScheduleEnabled();
  const overdue = studySessions.filter((item) => item.date < today && !getItemState(item.id).done);
  const moved = scheduledSessions.filter((item) => item.moved && !getItemState(item.id).done);
  const lastScheduled = [...scheduledSessions].reverse().find((item) => item.type !== "rest" && item.type !== "exam" && !getItemState(item.id).done);
  const dailyLoads = scheduledSessions.filter((item) => item.type !== "rest" && item.type !== "exam" && !getItemState(item.id).done).reduce((loads, item) => ({ ...loads, [item.date]: (loads[item.date] || 0) + item.duration }), {});
  const overloadedDates = Object.entries(dailyLoads).filter(([date, minutes]) => minutes > dailyStudyCapacity(date));
  const toggle = $("#smart-schedule-toggle");
  toggle.checked = enabled;
  $("#catchup").classList.toggle("active", enabled);

  if (!enabled) {
    $("#catchup-title").textContent = "Original dates are locked.";
    $("#catchup-message").textContent = overdue.length ? `${overdue.length} overdue ${overdue.length === 1 ? "session remains" : "sessions remain"} on the original roadmap.` : "Your original roadmap is unchanged.";
    return;
  }

  if (!overdue.length) {
    $("#catchup-title").textContent = "You’re following the original flow.";
    $("#catchup-message").textContent = "Nothing needs moving. Rest days and exam day remain protected.";
    return;
  }

  if (overloadedDates.length) {
    const [date, minutes] = overloadedDates.at(-1);
    $("#catchup-title").textContent = "Your remaining plan is at capacity.";
    $("#catchup-message").textContent = `${overdue.length} overdue ${overdue.length === 1 ? "session was" : "sessions were"} moved forward, but ${formatMinutes(minutes)} now lands on ${formatDate(date)}. Complete catch-up work early when possible; rest and exam days are still protected.`;
    return;
  }

  $("#catchup-title").textContent = `${overdue.length} overdue ${overdue.length === 1 ? "session has" : "sessions have"} been rebalanced.`;
  $("#catchup-message").textContent = `${moved.length} upcoming ${moved.length === 1 ? "session now has" : "sessions now have"} a smart date. Your practice order is preserved${lastScheduled ? ` through ${formatDate(lastScheduled.date)}` : ""}, before the protected rest days.`;
}

function notebookEntries() {
  return allSessions
    .filter((item) => item.scoreable)
    .map((item) => ({ item, itemState: getItemState(item.id), log: getItemState(item.id).errorLog || {} }))
    .filter(({ log }) => Number(log.missed || 0) > 0 || log.services || log.reason || log.principle)
    .sort((a, b) => (b.itemState.date || b.item.date).localeCompare(a.itemState.date || a.item.date));
}

function renderNotebook() {
  const entries = notebookEntries();
  const totalMissed = entries.reduce((sum, entry) => sum + Number(entry.log.missed || 0), 0);
  const services = new Map();
  const reasons = new Map();

  entries.forEach(({ log }) => {
    String(log.services || "").split(",").map((value) => value.trim()).filter(Boolean).forEach((service) => {
      const key = service.toLowerCase();
      services.set(key, { label: service, count: (services.get(key)?.count || 0) + 1 });
    });
    if (log.reason) reasons.set(log.reason, (reasons.get(log.reason) || 0) + 1);
  });

  const topServices = [...services.values()].sort((a, b) => b.count - a.count).slice(0, 4);
  const commonReason = [...reasons.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "Not enough data";
  $("#notebook-count").textContent = `${totalMissed} ${totalMissed === 1 ? "mistake" : "mistakes"} logged`;
  $("#notebook-summary").innerHTML = `
    <article><small>Total misses</small><strong>${totalMissed}</strong><span>Across ${entries.length} ${entries.length === 1 ? "test" : "tests"}</span></article>
    <article><small>Recurring services</small><strong>${services.size}</strong><span>${topServices.length ? topServices.map((entry) => escapeHTML(entry.label)).join(" · ") : "Add services when reviewing"}</span></article>
    <article><small>Most common cause</small><strong class="summary-text">${escapeHTML(commonReason)}</strong><span>Use this to change your test strategy</span></article>`;

  if (!entries.length) {
    $("#notebook-list").innerHTML = `<div class="empty-state notebook-empty"><strong>Your notebook is ready.</strong><p>Complete a practice test and add its missed questions, weak services, and the principle you want to remember.</p></div>`;
    return;
  }

  $("#notebook-list").innerHTML = entries.map(({ item, itemState, log }) => {
    const confidence = Number(log.confidence || 0);
    const dots = [1, 2, 3, 4, 5].map((value) => `<span class="${value <= confidence ? "filled" : ""}"></span>`).join("");
    return `
      <button class="notebook-entry" type="button" data-open-id="${item.id}">
        <span class="notebook-date">${formatDate(itemState.date || item.date, { month: "short", day: "numeric" })}</span>
        <span class="notebook-copy"><small>${escapeHTML(item.phaseTitle)} · ${Number(log.missed || 0)} missed</small><strong>${escapeHTML(item.title)}</strong><em>${escapeHTML(log.services || "No services tagged")}</em>${log.principle ? `<p>${escapeHTML(log.principle)}</p>` : ""}</span>
        <span class="notebook-meta"><b>${escapeHTML(log.reason || "Unclassified")}</b><span class="confidence-dots" aria-label="Confidence ${confidence || "not rated"} out of 5">${dots}</span></span>
      </button>`;
  }).join("");
}

function getScoreEntries() {
  return allSessions
    .filter((item) => item.scoreable)
    .map((item) => ({ item, itemState: getItemState(item.id), score: Number(getItemState(item.id).score) }))
    .filter(({ itemState, score }) => itemState.done && Number.isFinite(score) && score >= 0 && itemState.score !== "")
    .sort((a, b) => (a.itemState.date || a.item.date).localeCompare(b.itemState.date || b.item.date));
}

function average(values) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
}

function renderAnalytics() {
  const entries = getScoreEntries();
  const scores = entries.map((entry) => entry.score);
  const overall = average(scores);
  const recent = average(scores.slice(-3));
  const previous = average(scores.slice(-6, -3));
  const best = scores.length ? Math.max(...scores) : null;
  const trend = recent !== null && previous !== null ? recent - previous : null;
  const loggedTests = notebookEntries().length;

  $("#analytics-summary").innerHTML = `
    <article><small>Average score</small><strong>${overall === null ? "—" : `${overall}%`}</strong><span>${scores.length} scored ${scores.length === 1 ? "test" : "tests"}</span></article>
    <article><small>Recent average</small><strong>${recent === null ? "—" : `${recent}%`}</strong><span>Last three results</span></article>
    <article><small>Best score</small><strong>${best === null ? "—" : `${best}%`}</strong><span>Your current high mark</span></article>
    <article><small>Reviewed tests</small><strong>${loggedTests}</strong><span>With wrong-answer details</span></article>`;

  $("#score-trend-label").textContent = trend === null ? "Add six scores to reveal a trend" : trend > 0 ? `↑ ${trend} points vs previous three` : trend < 0 ? `↓ ${Math.abs(trend)} points vs previous three` : "Holding steady";

  $("#mode-analytics").innerHTML = Object.entries(modeLabels).map(([phaseId, label]) => {
    const modeEntries = entries.filter(({ item }) => item.phaseId === phaseId);
    const modeAverage = average(modeEntries.map((entry) => entry.score));
    const total = allSessions.filter((item) => item.phaseId === phaseId && item.scoreable).length;
    return `<div class="mode-row"><div><span>${label}</span><small>${modeEntries.length}/${total} scored</small></div><div class="mode-track"><span style="width:${modeAverage || 0}%"></span></div><strong>${modeAverage === null ? "—" : `${modeAverage}%`}</strong></div>`;
  }).join("");

  const recentEntries = entries.slice(-12);
  if (!recentEntries.length) {
    $("#score-history").innerHTML = `<div class="empty-chart"><span></span><span></span><span></span><span></span><p>Your score history will appear here.</p></div>`;
    return;
  }
  $("#score-history").innerHTML = recentEntries.map(({ item, itemState, score }) => `<div class="score-column" title="${escapeHTML(item.title)}: ${score}%"><strong>${score}</strong><div><span style="height:${Math.max(4, score)}%"></span></div><small>${formatDate(itemState.date || item.date, { month: "short", day: "numeric" })}</small></div>`).join("");
}

function renderReadiness() {
  let combined = 0;
  const rows = Object.entries(domainNames).map(([domain, label]) => {
    const direct = studySessions.filter((item) => item.domain === domain);
    const done = direct.filter((item) => getItemState(item.id).done);
    const completion = direct.length ? done.length / direct.length : 0;
    const scored = done.map((item) => Number(getItemState(item.id).score)).filter((score) => Number.isFinite(score) && score > 0);
    const scoreFactor = scored.length ? scored.reduce((sum, score) => sum + score, 0) / scored.length / 100 : completion;
    const pct = Math.round((completion * 0.65 + scoreFactor * 0.35) * 100);
    combined += pct;
    return `<div class="domain-row"><div><span>${label}</span><strong>${pct}%</strong></div><div class="domain-track"><span style="width:${pct}%"></span></div></div>`;
  });
  $("#domain-bars").innerHTML = rows.join("");
  $("#readiness-score").textContent = `${Math.round(combined / 4)}%`;
}

function updateOverview(today, scheduledSessions) {
  const progress = progressFor(studySessions);
  const remaining = Math.max(0, daysUntil(EXAM_DATE));
  const scheduledStudy = scheduledSessions.filter((item) => item.type !== "rest" && item.type !== "exam");
  const due = scheduledStudy.filter((item) => item.date <= today);
  const dueDone = due.filter((item) => getItemState(item.id).done).length;
  const nextMock = scheduledStudy.find((item) => item.date >= today && item.type === "practice" && (item.title.startsWith("Timed Mode") || item.title.includes("timed test")) && !getItemState(item.id).done);

  $("#days-left").textContent = remaining;
  $("#done-count").textContent = progress.done;
  $("#total-count").textContent = progress.total;
  $("#pct").textContent = `${progress.pct}%`;
  $("#bar").style.width = `${progress.pct}%`;
  $("#next-mock").textContent = nextMock ? formatDate(nextMock.date) : "Complete";

  let pace = "Fresh start";
  if (due.length && dueDone === due.length) pace = "On track";
  else if (due.length && dueDone / due.length >= 0.75) pace = "Nearly there";
  else if (due.length > 2) pace = `${due.length - dueDone} to catch up`;
  $("#pace-value").textContent = pace;
  $("#hero-message").textContent = progress.done ? `${progress.done} focused sessions banked. Keep the line moving.` : "A fresh plan. One focused session at a time.";
}

function bindDynamicEvents(root = document) {
  [...root.querySelectorAll('[data-open-id]')].forEach((button) => button.addEventListener("click", () => openModal(button.dataset.openId)));
  [...root.querySelectorAll('[data-check-id]')].forEach((button) => button.addEventListener("click", () => toggleItem(button.dataset.checkId)));
}

function render() {
  const today = localDateISO();
  const hour = new Date().getHours();
  const scheduledSessions = getScheduledSessions(today);
  $("#greeting").textContent = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
  $("#current-date").textContent = new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
  renderCatchUp(today, scheduledSessions);
  renderFocus(today, scheduledSessions);
  renderSchedule(today, scheduledSessions);
  renderNotebook();
  renderAnalytics();
  renderReadiness();
  updateOverview(today, scheduledSessions);
  bindDynamicEvents();
}

function toggleItem(id) {
  if (!state.items) state.items = {};
  const current = getItemState(id);
  if (current.done) delete state.items[id];
  else {
    const item = allSessions.find((candidate) => candidate.id === id);
    if (item?.scoreable) {
      openModal(id);
      return;
    }
    state.items[id] = { ...current, done: true, date: localDateISO() };
  }
  saveState(current.done ? "Session moved back to your plan." : "Session complete. Nice work.");
}

function openModal(id) {
  const item = allSessions.find((candidate) => candidate.id === id);
  if (!item) return;
  activeId = id;
  const itemState = getItemState(id);
  const scheduledItem = getScheduledSessions().find((candidate) => candidate.id === id) || item;
  const errorLog = itemState.errorLog || {};
  $("#modal-phase").textContent = item.phaseTitle;
  $("#modal-title").textContent = item.title;
  $("#modal-meta").textContent = `${formatDate(scheduledItem.date, { weekday: "long", month: "long", day: "numeric" })}${scheduledItem.moved ? ` · originally ${formatDate(item.date)}` : ""} · ${formatMinutes(item.duration)} · ${typeLabel(item.type)}`;
  $("#modal-date").value = itemState.date || localDateISO();
  $("#modal-score").value = itemState.score ?? "";
  $("#modal-note").value = itemState.note || "";
  $("#modal-missed").value = errorLog.missed ?? "";
  $("#modal-guessed").value = errorLog.guessed ?? "";
  $("#modal-services").value = errorLog.services || "";
  $("#modal-reason").value = errorLog.reason || "";
  $("#modal-principle").value = errorLog.principle || "";
  $("#modal-confidence").value = errorLog.confidence || "";
  $("#score-field").hidden = !item.scoreable;
  $("#practice-fields").hidden = !item.scoreable;
  $("#modal-clear-btn").style.visibility = itemState.done ? "visible" : "hidden";
  $("#modal-bg").classList.add("open");
  window.setTimeout(() => $("#modal-date").focus(), 80);
}

function closeModal() {
  $("#modal-bg").classList.remove("open");
  activeId = null;
}

function saveModal() {
  if (!activeId) return;
  const item = allSessions.find((candidate) => candidate.id === activeId);
  const score = $("#modal-score").value;
  if (score && (Number(score) < 0 || Number(score) > 100)) {
    showToast("Enter a score between 0 and 100.", "warning");
    return;
  }
  if (!state.items) state.items = {};
  state.items[activeId] = {
    done: true,
    date: $("#modal-date").value || localDateISO(),
    score: score === "" ? "" : Number(score),
    note: $("#modal-note").value.trim(),
    ...(item?.scoreable ? {
      errorLog: {
        missed: $("#modal-missed").value === "" ? 0 : Number($("#modal-missed").value),
        guessed: $("#modal-guessed").value === "" ? 0 : Number($("#modal-guessed").value),
        services: $("#modal-services").value.trim(),
        reason: $("#modal-reason").value,
        principle: $("#modal-principle").value.trim(),
        confidence: $("#modal-confidence").value === "" ? "" : Number($("#modal-confidence").value)
      }
    } : {})
  };
  closeModal();
  saveState("Session saved. Your plan is up to date.");
}

function clearModalItem() {
  if (!activeId) return;
  delete state.items[activeId];
  closeModal();
  saveState("Session moved back to your plan.");
}

function openResetConfirm() {
  $("#confirm-bg").classList.add("open");
}

function closeResetConfirm() {
  $("#confirm-bg").classList.remove("open");
}

function resetAll() {
  state = { items: {}, settings: { smartSchedule: true } };
  closeResetConfirm();
  saveState("Your September 5 plan has been reset.");
}

function initStaticEvents() {
  $("#modal-close-x-btn").addEventListener("click", closeModal);
  $("#modal-save-btn").addEventListener("click", saveModal);
  $("#modal-clear-btn").addEventListener("click", clearModalItem);
  $("#modal-bg").addEventListener("click", (event) => { if (event.target.id === "modal-bg") closeModal(); });
  $("#reset-btn").addEventListener("click", openResetConfirm);
  $("#reset-cancel").addEventListener("click", closeResetConfirm);
  $("#reset-confirm").addEventListener("click", resetAll);
  $("#confirm-bg").addEventListener("click", (event) => { if (event.target.id === "confirm-bg") closeResetConfirm(); });
  $("#smart-schedule-toggle").addEventListener("change", (event) => {
    if (!state.settings) state.settings = {};
    state.settings.smartSchedule = event.target.checked;
    saveState(event.target.checked ? "Smart catch-up is balancing future sessions." : "Original schedule dates restored.");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeResetConfirm();
    }
  });
  $$(".filter-pill").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    $$(".filter-pill").forEach((pill) => pill.classList.toggle("active", pill === button));
    render();
  }));
  $$(".nav-link").forEach((link) => link.addEventListener("click", () => {
    $$(".nav-link").forEach((item) => item.classList.toggle("active", item === link));
  }));
}

async function initApp() {
  initStaticEvents();
  setupConnectionState();
  render();
  try {
    $("#loading-text").textContent = "Syncing your September plan…";
    const app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
    setupRealtimeSync();
    window.setTimeout(() => {
      if (isInitialLoad) fallbackToLocal();
    }, 5000);
  } catch {
    fallbackToLocal("startup-error");
  }
}

document.addEventListener("DOMContentLoaded", initApp);
