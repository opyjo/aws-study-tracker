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
  phase("reboot", "01", "Reset & rebuild", "Jul 18 — Jul 26", "Find the gaps, then rebuild the services everything else depends on.", [
    session("2026-07-18", "Fresh-start diagnostic", "65 questions · timed baseline · no notes", 130, "practice", "general", true),
    session("2026-07-18", "Build the weak-area list", "Tag every miss by domain and service", 30, "review"),
    session("2026-07-19", "Diagnostic answer review", "Read every explanation, including correct guesses", 120, "review"),
    session("2026-07-20", "IAM, Organizations & identity", "Policies, roles, SCPs, federation and Identity Center", 60, "learn", "security"),
    session("2026-07-21", "VPC foundations", "Subnets, routing, NAT, endpoints and security groups", 60, "learn", "resilience"),
    session("2026-07-22", "EC2, ELB & Auto Scaling", "Placement, purchasing, health checks and scaling policy", 60, "learn", "performance"),
    session("2026-07-23", "S3 & storage decisions", "Classes, lifecycle, replication, EBS and EFS", 90, "learn", "cost"),
    session("2026-07-24", "Database decision map", "RDS, Aurora, DynamoDB and ElastiCache", 90, "learn", "performance"),
    session("2026-07-25", "Core services mini-test", "40 mixed questions · target 72%+", 75, "practice", "general", true),
    session("2026-07-26", "Mini-test review + flashcards", "Turn repeated mistakes into short prompts", 90, "review")
  ]),
  phase("mastery", "02", "Service mastery", "Jul 27 — Aug 9", "Connect individual AWS services into secure, resilient architectures.", [
    session("2026-07-27", "Serverless patterns", "Lambda, API Gateway, concurrency and integrations", 60, "learn", "performance"),
    session("2026-07-28", "Messaging & decoupling", "SQS, SNS, EventBridge, Step Functions and MQ", 60, "learn", "resilience"),
    session("2026-07-29", "DNS & global delivery", "Route 53, CloudFront and Global Accelerator", 60, "learn", "performance"),
    session("2026-07-30", "Encryption & secrets", "KMS, CloudHSM, ACM, Secrets Manager and Parameter Store", 90, "learn", "security"),
    session("2026-07-31", "Security visibility", "CloudTrail, Config, GuardDuty, Inspector, Macie and Security Hub", 90, "learn", "security"),
    session("2026-08-01", "Security domain test", "Domain 1 question set · target 75%+", 90, "practice", "security", true),
    session("2026-08-02", "Security test review", "Explain why each distractor is wrong", 90, "review", "security"),
    session("2026-08-03", "High availability patterns", "Multi-AZ, Multi-Region, failover and health checks", 60, "learn", "resilience"),
    session("2026-08-04", "Disaster recovery", "Backup/restore, pilot light, warm standby and active-active", 60, "learn", "resilience"),
    session("2026-08-05", "Migration & transfer", "DMS, SCT, DataSync, Snow Family and Transfer Family", 60, "learn", "resilience"),
    session("2026-08-06", "Observability & operations", "CloudWatch metrics, logs, alarms and Systems Manager", 90, "learn", "performance"),
    session("2026-08-07", "Cost optimization patterns", "Compute, storage, data transfer and Savings Plans", 90, "learn", "cost"),
    session("2026-08-08", "Resilience domain test", "Domain 2 question set · target 75%+", 90, "practice", "resilience", true),
    session("2026-08-09", "Resilience review + recall", "Review misses, then blank-page architecture recall", 90, "review", "resilience")
  ]),
  phase("domains", "03", "Domain strength", "Aug 10 — Aug 23", "Turn knowledge into fast decisions across all four exam domains.", [
    session("2026-08-10", "Secure architecture scenarios", "Least privilege, boundaries and multi-account design", 60, "review", "security"),
    session("2026-08-11", "Resilient architecture scenarios", "Remove single points of failure and choose recovery targets", 60, "review", "resilience"),
    session("2026-08-12", "Performance scenarios", "Match workloads to compute, database and storage", 60, "review", "performance"),
    session("2026-08-13", "Cost scenarios", "Choose the lowest-cost option that meets requirements", 90, "review", "cost"),
    session("2026-08-14", "Mixed scenario sprint", "30 questions · 75 seconds per question", 75, "practice", "general", true),
    session("2026-08-15", "Full mock exam #1", "65 questions · 130 minutes · exam conditions", 130, "practice", "general", true),
    session("2026-08-16", "Mock #1 deep review", "Log service gap, reasoning error and clue missed", 150, "review"),
    session("2026-08-17", "Weak-area repair: set A", "Top two services from Mock #1", 60, "review", "general"),
    session("2026-08-18", "Weak-area repair: set B", "Next two services from Mock #1", 60, "review", "general"),
    session("2026-08-19", "Architecture comparison drill", "Build quick tables for commonly confused services", 60, "review", "performance"),
    session("2026-08-20", "Security + resilience sprint", "35 mixed domain questions", 90, "practice", "security", true),
    session("2026-08-21", "Performance + cost sprint", "35 mixed domain questions", 90, "practice", "cost", true),
    session("2026-08-22", "Full mock exam #2", "65 questions · target 78%+", 130, "practice", "general", true),
    session("2026-08-23", "Mock #2 deep review", "Resolve every miss and every low-confidence guess", 150, "review")
  ]),
  phase("simulation", "04", "Exam simulation", "Aug 24 — Sep 1", "Build pace, confidence and a repeatable exam-day method.", [
    session("2026-08-24", "Decision keywords drill", "Most secure, least operational overhead, most cost-effective", 60, "review", "general"),
    session("2026-08-25", "Weak-area repair: final list", "Only unresolved services from the error log", 60, "review", "general"),
    session("2026-08-26", "Timed 30-question set", "Practice flagging and moving on", 60, "practice", "general", true),
    session("2026-08-27", "Timed-set review", "Focus on reasoning and time lost", 90, "review"),
    session("2026-08-28", "Flashcard consolidation", "Retire known cards; keep only high-value gaps", 90, "review"),
    session("2026-08-29", "Full mock exam #3", "65 questions · target 82%+", 130, "practice", "general", true),
    session("2026-08-30", "Mock #3 deep review", "Final error log and confidence check", 150, "review"),
    session("2026-08-31", "Final domain tune-up", "One short drill for the lowest-scoring domain", 60, "practice", "general", true),
    session("2026-09-01", "Exam strategy rehearsal", "Two-pass method, timing checkpoints and flag rules", 45, "review")
  ]),
  phase("taper", "05", "Taper & arrive ready", "Sep 2 — Sep 5", "Reduce load, protect sleep and walk in with a calm plan.", [
    session("2026-09-02", "Final cheat-sheet pass", "Architecture patterns, limits and key comparisons", 45, "review", "general"),
    session("2026-09-03", "Light confidence review", "20 familiar questions only · stop after 45 minutes", 45, "review", "general", true),
    session("2026-09-04", "Full rest + exam setup", "Confirm ID, route, check-in details and sleep early", 15, "rest"),
    session("2026-09-05", "AWS SAA-C03 exam", "Breathe, read the requirement twice, trust the process", 130, "exam")
  ])
];

const allSessions = PHASES.flatMap((p) => p.sessions.map((s, index) => ({ ...s, id: `${p.id}-${s.date}-${index}`, phaseId: p.id, phaseTitle: p.title })));
const studySessions = allSessions.filter((s) => s.type !== "rest" && s.type !== "exam");
const domainNames = { security: "Secure", resilience: "Resilient", performance: "High-performing", cost: "Cost-optimized" };

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
  return `
    <article class="task-row ${done ? "done" : ""} ${focus ? "focus-task" : ""}" data-id="${item.id}">
      <button class="task-check" type="button" aria-label="${done ? "Mark incomplete" : "Mark complete"}: ${item.title}" data-check-id="${item.id}"><span>✓</span></button>
      <button class="task-content" type="button" data-open-id="${item.id}">
        <span class="task-topline"><span class="task-type ${item.type}">${typeLabel(item.type)}</span><span>${formatDate(item.date, { weekday: "short", month: "short", day: "numeric" })}</span></span>
        <strong>${item.title}</strong>
        <small>${item.detail}</small>
      </button>
      <div class="task-tail">${score}<span>${formatMinutes(item.duration)}</span><button type="button" data-open-id="${item.id}" aria-label="Open session details">↗</button></div>
    </article>`;
}

function renderFocus(today) {
  const todaySessions = allSessions.filter((item) => item.date === today);
  const unfinishedToday = todaySessions.filter((item) => !getItemState(item.id).done);
  let focusItems = unfinishedToday;
  let title = "Today’s plan";

  if (!focusItems.length && todaySessions.length) {
    focusItems = todaySessions;
    title = "Today — complete";
  }
  if (!focusItems.length) {
    const nextDate = allSessions.find((item) => item.date > today && !getItemState(item.id).done)?.date;
    focusItems = allSessions.filter((item) => item.date === nextDate);
    title = nextDate ? `Up next · ${formatDate(nextDate, { weekday: "long", month: "long", day: "numeric" })}` : "Plan complete";
  }

  $("#focus-title").textContent = title;
  $("#focus-duration").textContent = focusItems.length ? `${focusItems.length} ${focusItems.length === 1 ? "session" : "sessions"} · ${formatMinutes(focusItems.reduce((sum, item) => sum + item.duration, 0))}` : "You’re ready";
  $("#focus-list").innerHTML = focusItems.length ? focusItems.map((item) => taskMarkup(item, true)).join("") : `<div class="empty-state"><strong>Every session is complete.</strong><p>Protect your sleep and take that confidence into exam day.</p></div>`;
}

function renderSchedule(today) {
  const container = $("#schedule-list");
  container.innerHTML = PHASES.map((currentPhase) => {
    const status = phaseStatus(currentPhase, today);
    const progress = progressFor(currentPhase.sessions);
    const filteredSessions = currentPhase.sessions.filter((item) => activeFilter === "all" || item.type === activeFilter);
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
        <div class="phase-body">${filteredSessions.map((item) => taskMarkup({ ...item, id: allSessions.find((s) => s.phaseId === currentPhase.id && s.date === item.date && s.title === item.title).id })).join("")}</div>
      </details>`;
  }).join("");
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

function updateOverview(today) {
  const progress = progressFor(studySessions);
  const remaining = Math.max(0, daysUntil(EXAM_DATE));
  const due = studySessions.filter((item) => item.date <= today);
  const dueDone = due.filter((item) => getItemState(item.id).done).length;
  const nextMock = studySessions.find((item) => item.date >= today && item.type === "practice" && item.title.toLowerCase().includes("full mock") && !getItemState(item.id).done);

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
  $("#greeting").textContent = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
  $("#current-date").textContent = new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" });
  renderFocus(today);
  renderSchedule(today);
  renderReadiness();
  updateOverview(today);
  bindDynamicEvents();
}

function toggleItem(id) {
  if (!state.items) state.items = {};
  const current = getItemState(id);
  if (current.done) delete state.items[id];
  else state.items[id] = { ...current, done: true, date: localDateISO() };
  saveState(current.done ? "Session moved back to your plan." : "Session complete. Nice work.");
}

function openModal(id) {
  const item = allSessions.find((candidate) => candidate.id === id);
  if (!item) return;
  activeId = id;
  const itemState = getItemState(id);
  $("#modal-phase").textContent = item.phaseTitle;
  $("#modal-title").textContent = item.title;
  $("#modal-meta").textContent = `${formatDate(item.date, { weekday: "long", month: "long", day: "numeric" })} · ${formatMinutes(item.duration)} · ${typeLabel(item.type)}`;
  $("#modal-date").value = itemState.date || localDateISO();
  $("#modal-score").value = itemState.score ?? "";
  $("#modal-note").value = itemState.note || "";
  $("#score-field").hidden = !item.scoreable;
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
    note: $("#modal-note").value.trim()
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
  state = { items: {} };
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeResetConfirm();
    }
  });
  $$(".filter-pill").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    $$(".filter-pill").forEach((pill) => pill.classList.toggle("active", pill === button));
    renderSchedule(localDateISO());
    bindDynamicEvents($("#schedule-list"));
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
