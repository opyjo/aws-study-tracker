/**
 * AWS Study Tracker Core Logic & Firebase Integration
 * Built using Firebase v10 Modular SDK via CDN
 */

// 1. Firebase Modular SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  initializeFirestore, 
  doc, 
  setDoc, 
  onSnapshot, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMfHilqsLgdwFcCTrtXhacnkhLqpWm60c",
  authDomain: "aws-exam-tracker.firebaseapp.com",
  projectId: "aws-exam-tracker",
  storageBucket: "aws-exam-tracker.firebasestorage.app",
  messagingSenderId: "884281667059",
  appId: "1:884281667059:web:1f09f986c8929d31a57686",
  measurementId: "G-E569L61F7H"
};

// 3. Immutable Study Data Structure
const DATA = [
  {
    id:'phase-topic', label:'Phase 1 — Topic-Based Tests', color:'#3a8fd8',
    dates:'Jun 5 – Jun 11', note:'2 tests per day · morning + evening',
    groups:[
      { label:'Group 1 — Core compute & access', days:[
        { date:'2026-06-05', label:'Fri Jun 5', items:[
          {id:'t-iam', name:'Topic-Based — IAM',      time:'4:45 AM – 6:45 AM', block:'Morning',   tag:'topic'},
          {id:'t-ec2', name:'Topic-Based — EC2',      time:'6:00 PM – 8:00 PM', block:'Evening',   tag:'topic'},
        ]},
        { date:'2026-06-06', label:'Sat Jun 6', items:[
          {id:'t-vpc', name:'Topic-Based — VPC',      time:'5:15 AM – 7:15 AM', block:'Morning',   tag:'topic'},
          {id:'t-s3',  name:'Topic-Based — S3',       time:'5:30 PM – 7:30 PM', block:'Evening',   tag:'topic'},
        ]},
      ]},
      { label:'Group 2 — Storage', days:[
        { date:'2026-06-07', label:'Sun Jun 7', items:[
          {id:'t-ebs', name:'Topic-Based — EBS',      time:'5:15 AM – 7:15 AM', block:'Morning',   tag:'topic'},
          {id:'t-efs', name:'Topic-Based — EFS',      time:'5:30 PM – 7:30 PM', block:'Evening',   tag:'topic'},
        ]},
      ]},
      { label:'Group 3 — Databases', days:[
        { date:'2026-06-08', label:'Mon Jun 8', items:[
          {id:'t-rds', name:'Topic-Based — RDS',      time:'8:30 AM – 11:00 AM',block:'Block 1',   tag:'topic'},
          {id:'t-ddb', name:'Topic-Based — DynamoDB', time:'12:00 PM – 2:30 PM', block:'Block 2',  tag:'topic'},
        ]},
      ]},
      { label:'Group 4 — Scaling & delivery', days:[
        { date:'2026-06-09', label:'Tue Jun 9', items:[
          {id:'t-asg', name:'Topic-Based — Auto Scaling',time:'8:30 AM – 11:00 AM',block:'Block 1',tag:'topic'},
          {id:'t-elb', name:'Topic-Based — ELB',         time:'12:00 PM – 2:30 PM', block:'Block 2',tag:'topic'},
        ]},
        { date:'2026-06-10', label:'Wed Jun 10', items:[
          {id:'t-cf',  name:'Topic-Based — CloudFront',time:'4:45 AM – 6:45 AM',  block:'Morning', tag:'topic'},
          {id:'t-lam', name:'Topic-Based — Lambda',    time:'6:00 PM – 8:00 PM',  block:'Evening', tag:'topic'},
        ]},
      ]},
      { label:'Group 5 — App & messaging', days:[
        { date:'2026-06-11', label:'Thu Jun 11', items:[
          {id:'t-sqs', name:'Topic-Based — SQS',      time:'4:45 AM – 6:45 AM',  block:'Morning', tag:'topic'},
        ]},
      ]},
    ]
  },
  {
    id:'phase-review', label:'Phase 2 — Review Mode', color:'#1a9e6a',
    dates:'Jun 12 – Jun 20', note:'1 set per morning · read every explanation',
    groups:[
      { label:'Diagnostic + Sets 1–5', days:[
        { date:'2026-06-12', label:'Fri Jun 12', items:[
          {id:'r-diag',name:'Review Mode — Diagnostic Test', time:'4:45 AM – 6:45 AM', block:'Morning', tag:'review'},
          {id:'r-diag-ev',name:'Evening — review wrong answers from diagnostic', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'review'},
        ]},
        { date:'2026-06-13', label:'Sat Jun 13', items:[
          {id:'r-1',   name:'Review Mode — Set 1',           time:'5:15 AM – 7:15 AM', block:'Morning', tag:'review'},
          {id:'r-1-ev',name:'Evening — review wrong answers from Set 1', time:'5:30 PM – 7:30 PM', block:'Evening', tag:'review'},
        ]},
        { date:'2026-06-14', label:'Sun Jun 14', items:[
          {id:'r-2',   name:'Review Mode — Set 2',           time:'5:15 AM – 7:15 AM', block:'Morning', tag:'review'},
          {id:'r-2-ev',name:'Evening — review wrong answers from Set 2', time:'5:30 PM – 7:30 PM', block:'Evening', tag:'review'},
        ]},
        { date:'2026-06-15', label:'Mon Jun 15', items:[
          {id:'r-3',   name:'Review Mode — Set 3',           time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'review'},
          {id:'r-3-ev',name:'Block 2 — review wrong answers from Set 3', time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'review'},
        ]},
        { date:'2026-06-16', label:'Tue Jun 16', items:[
          {id:'r-4',   name:'Review Mode — Set 4',           time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'review'},
          {id:'r-4-ev',name:'Block 2 — review wrong answers from Set 4', time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'review'},
        ]},
      ]},
      { label:'Sets 5–8', days:[
        { date:'2026-06-17', label:'Wed Jun 17', items:[
          {id:'r-5',   name:'Review Mode — Set 5',           time:'4:45 AM – 6:45 AM', block:'Morning', tag:'review'},
          {id:'r-5-ev',name:'Evening — review wrong answers from Set 5', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'review'},
        ]},
        { date:'2026-06-18', label:'Thu Jun 18', items:[
          {id:'r-6',   name:'Review Mode — Set 6',           time:'4:45 AM – 6:45 AM', block:'Morning', tag:'review'},
          {id:'r-6-ev',name:'Evening — review wrong answers from Set 6', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'review'},
        ]},
        { date:'2026-06-19', label:'Fri Jun 19', items:[
          {id:'r-7',   name:'Review Mode — Set 7',           time:'4:45 AM – 6:45 AM', block:'Morning', tag:'review'},
          {id:'r-7-ev',name:'Evening — review wrong answers from Set 7', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'review'},
        ]},
        { date:'2026-06-20', label:'Sat Jun 20', items:[
          {id:'r-8',   name:'Bonus Review Mode — Set 8',     time:'5:15 AM – 7:15 AM', block:'Morning', tag:'bonus'},
          {id:'r-8-ev',name:'Evening — review wrong answers from Bonus Set 8', time:'5:30 PM – 7:30 PM', block:'Evening', tag:'bonus'},
        ]},
      ]},
    ]
  },
  {
    id:'phase-timed', label:'Phase 3 — Timed Mode', color:'#c07a10',
    dates:'Jun 21 – Jun 29', note:'Simulate real exam pressure · 65 questions · 130 mins',
    groups:[
      { label:'Diagnostic + Sets 1–4', days:[
        { date:'2026-06-21', label:'Sun Jun 21', items:[
          {id:'tm-diag',name:'Timed Mode — Diagnostic Test', time:'5:15 AM – 7:15 AM', block:'Morning', tag:'timed'},
          {id:'tm-diag-ev',name:'Evening — review timed diagnostic wrong answers', time:'5:30 PM – 7:30 PM', block:'Evening', tag:'timed'},
        ]},
        { date:'2026-06-22', label:'Mon Jun 22', items:[
          {id:'tm-1',   name:'Timed Mode — Set 1',           time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'timed'},
          {id:'tm-1-ev',name:'Block 2 — review Set 1 wrong answers', time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'timed'},
        ]},
        { date:'2026-06-23', label:'Tue Jun 23', items:[
          {id:'tm-2',   name:'Timed Mode — Set 2',           time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'timed'},
          {id:'tm-2-ev',name:'Block 2 — review Set 2 wrong answers', time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'timed'},
        ]},
        { date:'2026-06-24', label:'Wed Jun 24', items:[
          {id:'tm-3',   name:'Timed Mode — Set 3',           time:'4:45 AM – 6:45 AM', block:'Morning', tag:'timed'},
          {id:'tm-3-ev',name:'Evening — review Set 3 wrong answers', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'timed'},
        ]},
        { date:'2026-06-25', label:'Thu Jun 25', items:[
          {id:'tm-4',   name:'Timed Mode — Set 4',           time:'4:45 AM – 6:45 AM', block:'Morning', tag:'timed'},
          {id:'tm-4-ev',name:'Evening — review Set 4 wrong answers', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'timed'},
        ]},
      ]},
      { label:'Sets 5–8', days:[
        { date:'2026-06-26', label:'Fri Jun 26', items:[
          {id:'tm-5',   name:'Timed Mode — Set 5',           time:'4:45 AM – 6:45 AM', block:'Morning', tag:'timed'},
          {id:'tm-5-ev',name:'Evening — review Set 5 wrong answers', time:'6:00 PM – 8:00 PM', block:'Evening', tag:'timed'},
        ]},
        { date:'2026-06-27', label:'Sat Jun 27', items:[
          {id:'tm-6',   name:'Timed Mode — Set 6',           time:'5:15 AM – 7:15 AM', block:'Morning', tag:'timed'},
          {id:'tm-6-ev',name:'Evening — review Set 6 wrong answers', time:'5:30 PM – 7:30 PM', block:'Evening', tag:'timed'},
        ]},
        { date:'2026-06-28', label:'Sun Jun 28', items:[
          {id:'tm-7',   name:'Timed Mode — Set 7',           time:'5:15 AM – 7:15 AM', block:'Morning', tag:'timed'},
          {id:'tm-7-ev',name:'Evening — review Set 7 wrong answers', time:'5:30 PM – 7:30 PM', block:'Evening', tag:'timed'},
        ]},
        { date:'2026-06-29', label:'Mon Jun 29', items:[
          {id:'tm-8',   name:'Bonus Timed Mode — Set 8',     time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'bonus'},
          {id:'tm-8-ev',name:'Block 2 — review Bonus Set 8 wrong answers', time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'bonus'},
        ]},
      ]},
    ]
  },
  {
    id:'phase-section', label:'Phase 4 — Section-Based Tests', color:'#d05030',
    dates:'Jun 30 – Jul 3', note:'All 4 exam domains · done before end of June ✓',
    groups:[
      { label:'All 4 exam domains', days:[
        { date:'2026-06-30', label:'Tue Jun 30', items:[
          {id:'s-secure',    name:'Section — Design Secure Architectures',          time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'section'},
          {id:'s-secure-ev', name:'Block 2 — review Secure wrong answers',          time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'section'},
        ]},
        { date:'2026-07-01', label:'Wed Jul 1', items:[
          {id:'s-resilient',    name:'Section — Design Resilient Architectures',       time:'4:45 AM – 6:45 AM', block:'Morning', tag:'section'},
          {id:'s-resilient-ev', name:'Evening — review Resilient wrong answers',       time:'6:00 PM – 8:00 PM', block:'Evening', tag:'section'},
        ]},
        { date:'2026-07-02', label:'Thu Jul 2', items:[
          {id:'s-perform',    name:'Section — Design High-Performing Architectures', time:'4:45 AM – 6:45 AM', block:'Morning', tag:'section'},
          {id:'s-perform-ev', name:'Evening — review High-Perf wrong answers',       time:'6:00 PM – 8:00 PM', block:'Evening', tag:'section'},
        ]},
        { date:'2026-07-03', label:'Fri Jul 3', items:[
          {id:'s-cost',    name:'Section — Design Cost-Optimized Architectures',  time:'4:45 AM – 6:45 AM', block:'Morning', tag:'section'},
          {id:'s-cost-ev', name:'Evening — review Cost-Opt wrong answers',        time:'6:00 PM – 8:00 PM', block:'Evening', tag:'section'},
        ]},
      ]},
    ]
  },
  {
    id:'phase-consolidation', label:'Phase 5 — Consolidation', color:'#7a70d0',
    dates:'Jul 4 – Jul 23', note:'Flashcards · wrong answer reviews · weak area drill · taper',
    groups:[
      { label:'Late June — bonus consolidation week', days:[
        { date:'2026-07-04', label:'Sat Jul 4', items:[
          {id:'fl-1',   name:'Flashcards — Part 1 (full review)',              time:'5:15 AM – 7:15 AM', block:'Morning', tag:'flash'},
          {id:'fl-1-ev',name:'Evening — weak area drill from topic/review scores',time:'5:30 PM – 7:30 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-05', label:'Sun Jul 5', items:[
          {id:'fl-2',   name:'Flashcards — Part 2 (full review)',              time:'5:15 AM – 7:15 AM', block:'Morning', tag:'flash'},
          {id:'fl-2-ev',name:'Evening — weak area drill (continue)',           time:'5:30 PM – 7:30 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-06', label:'Mon Jul 6', items:[
          {id:'wa-1',   name:'Wrong answers mega review — all topic tests',    time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'flash'},
          {id:'wa-2',   name:'Wrong answers mega review — all review sets',    time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'flash'},
        ]},
        { date:'2026-07-07', label:'Tue Jul 7', items:[
          {id:'wa-3',   name:'Wrong answers mega review — all timed sets',     time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'flash'},
          {id:'wa-4',   name:'Wrong answers mega review — all section tests',  time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'flash'},
        ]},
        { date:'2026-07-08', label:'Wed Jul 8', items:[
          {id:'qp-1',   name:'Section quick-pass — Secure + Resilient',        time:'4:45 AM – 6:45 AM', block:'Morning', tag:'section'},
          {id:'qp-1-ev',name:'Evening — weak area drill (lowest scoring service)',time:'6:00 PM – 8:00 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-09', label:'Thu Jul 9', items:[
          {id:'qp-2',   name:'Section quick-pass — High-Perf + Cost-Opt',      time:'4:45 AM – 6:45 AM', block:'Morning', tag:'section'},
          {id:'qp-2-ev',name:'Evening — weak area drill (second weakest service)',time:'6:00 PM – 8:00 PM', block:'Evening', tag:'flash'},
        ]},
      ]},
      { label:'July — final prep & taper', days:[
        { date:'2026-07-10', label:'Fri Jul 10', items:[
          {id:'j-1',   name:'Weak area drill — final gaps only',              time:'4:45 AM – 6:45 AM', block:'Morning', tag:'flash'},
          {id:'j-1-ev',name:'Evening — review remaining wrong answers',       time:'6:00 PM – 8:00 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-11', label:'Sat Jul 11', items:[
          {id:'j-2',   name:'Weak area drill — consolidation',                time:'5:15 AM – 7:15 AM', block:'Morning', tag:'flash'},
          {id:'j-2-ev',name:'Evening — cheat sheet pass through',             time:'5:30 PM – 7:30 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-12', label:'Sun Jul 12', items:[
          {id:'j-3',   name:'Final timed test — benchmark your readiness',    time:'5:15 AM – 7:15 AM', block:'Morning', tag:'timed'},
          {id:'j-3-ev',name:'Evening — review final test wrong answers',      time:'5:30 PM – 7:30 PM', block:'Evening', tag:'timed'},
        ]},
        { date:'2026-07-13', label:'Mon Jul 13', items:[
          {id:'j-4',   name:'Weak area drill — anything flagged from final test',time:'8:30 AM – 11:00 AM',block:'Block 1',tag:'flash'},
          {id:'j-4-ev',name:'Block 2 — light review, no pressure',            time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'flash'},
        ]},
        { date:'2026-07-14', label:'Tue Jul 14', items:[
          {id:'j-5',   name:'Flashcards — rapid-fire both parts',             time:'8:30 AM – 11:00 AM',block:'Block 1', tag:'flash'},
          {id:'j-5-ev',name:'Block 2 — relax, light review only',             time:'12:00 PM – 2:30 PM', block:'Block 2', tag:'flash'},
        ]},
        { date:'2026-07-15', label:'Wed Jul 15', items:[
          {id:'j-6',   name:'Cheat sheet review — no new questions',          time:'4:45 AM – 6:45 AM', block:'Morning', tag:'flash'},
          {id:'j-6-ev',name:'Evening — final flashcard pass',                 time:'6:00 PM – 8:00 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-16', label:'Thu Jul 16', items:[
          {id:'j-7',   name:'Cheat sheet review — focus on weak domains',     time:'4:45 AM – 6:45 AM', block:'Morning', tag:'flash'},
          {id:'j-7-ev',name:'Evening — light review only, wind down',         time:'6:00 PM – 8:00 PM', block:'Evening', tag:'flash'},
        ]},
        { date:'2026-07-17', label:'Fri Jul 17', items:[
          {id:'j-8',   name:'LAST STUDY DAY — flashcards only, keep it light',time:'4:45 AM – 6:45 AM', block:'Morning', tag:'flash'},
          {id:'j-8-ev',name:'Evening — stop studying after this. You are ready.',time:'6:00 PM – 7:00 PM', block:'Evening', tag:'flash'},
        ]},
      ]},
      { label:'Final rest before exam', days:[
        { date:'2026-07-18', label:'Sat Jul 18', items:[
          {id:'rest-1', name:'REST — no studying',                             time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-19', label:'Sun Jul 19', items:[
          {id:'rest-2', name:'REST — no studying',                             time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-20', label:'Mon Jul 20', items:[
          {id:'rest-3', name:'REST — enjoy your weekend',                      time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-21', label:'Tue Jul 21', items:[
          {id:'rest-4', name:'REST — enjoy your weekend',                      time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-22', label:'Wed Jul 22', items:[
          {id:'rest-5', name:'REST — no studying',                             time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-23', label:'Thu Jul 23', items:[
          {id:'rest-6', name:'REST — no studying',                             time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-24', label:'Fri Jul 24', items:[
          {id:'rest-7', name:'REST — no studying',                             time:'—', block:'Full day', tag:'rest'},
        ]},
        { date:'2026-07-25', label:'Sat Jul 25', items:[
          {id:'rest-8', name:'REST — exam tomorrow. Set up your space, sleep early.',time:'—', block:'Full day', tag:'rest'},
        ]},
      ]},
    ]
  },
];

// 4. Application Variables & State
let app, db, docRef;
const DOC_ID = 'default';
let state = {};
let activeId = null;
let isInitialLoad = true;
let unsubscribeSnapshot = null;

// 5. Toast Notification Utility
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;
  container.appendChild(toast);
  
  // Slide in effect
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);

  const dismissToast = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  };

  // Close click
  toast.querySelector('.toast-close').addEventListener('click', dismissToast);
  
  // Auto dismiss
  setTimeout(dismissToast, 4000);
}

// 6. Transition Out Loading Screen
function hideLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (screen) {
    screen.classList.add('hidden');
  }
}

// 7. Fallback to LocalStorage Mode
function fallbackToLocal(reason) {
  console.warn("Falling back to local storage:", reason);
  state = JSON.parse(localStorage.getItem('aws-tracker-v4') || '{}');
  
  const syncStatus = document.getElementById('sync-status');
  if (syncStatus) {
    syncStatus.className = 'sync-status offline';
    syncStatus.querySelector('.status-text').textContent = firebaseConfig.apiKey === "YOUR_API_KEY" ? "Local Mock" : "Offline";
  }
  
  hideLoadingScreen();
  render();
  
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    showToast("AWS Tracker running in Local Mock mode. Enter Firebase Config inside app.js for Cloud sync!", "warning");
  } else {
    showToast("Using local storage backup: " + reason, "warning");
  }
}

// 8. Connection State Event Listeners
function setupConnectionState() {
  window.addEventListener('online', () => {
    console.log("Internet back online");
    showToast("Internet connected. Syncing with database...", "success");
    if (!unsubscribeSnapshot) {
      setupRealtimeSync();
    }
  });
  
  window.addEventListener('offline', () => {
    console.log("Internet disconnected");
    const syncStatus = document.getElementById('sync-status');
    if (syncStatus) {
      syncStatus.className = 'sync-status offline';
      syncStatus.querySelector('.status-text').textContent = "Offline";
    }
    showToast("Internet disconnected. Progress saved locally.", "warning");
  });
}

// 9. Real-Time Firestore Synced Listener
function setupRealtimeSync() {
  if (!db) return;
  
  docRef = doc(db, "trackers", DOC_ID);
  
  unsubscribeSnapshot = onSnapshot(docRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      state = docSnapshot.data().state || {};
    } else {
      // Document does not exist in Firestore yet (new user).
      // Load current local storage items to upload as default, or start fresh.
      state = JSON.parse(localStorage.getItem('aws-tracker-v4') || '{}');
      saveStateFirestore(state);
    }
    
    // Save a copy locally as a fast backup layer
    localStorage.setItem('aws-tracker-v4', JSON.stringify(state));
    
    // Update Sync Pill status
    const syncStatus = document.getElementById('sync-status');
    if (syncStatus) {
      if (docSnapshot.metadata.hasPendingWrites) {
        syncStatus.className = 'sync-status syncing';
        syncStatus.querySelector('.status-text').textContent = "Syncing...";
      } else {
        syncStatus.className = 'sync-status online';
        syncStatus.querySelector('.status-text').textContent = "Synced";
        if (!isInitialLoad) {
          showToast("Cloud sync successfully completed!", "success");
        }
      }
    }
    
    render();
    
    if (isInitialLoad) {
      hideLoadingScreen();
      isInitialLoad = false;
    }
  }, (error) => {
    console.error("Firestore synchronisation error:", error);
    if (isInitialLoad) {
      fallbackToLocal("Firestore read permission error.");
    } else {
      showToast("Sync error: check permissions or connection", "error");
    }
  });
}

// 10. Save to Firestore
async function saveStateFirestore(updatedState) {
  if (!docRef) return;
  try {
    const syncStatus = document.getElementById('sync-status');
    if (syncStatus) {
      syncStatus.className = 'sync-status syncing';
      syncStatus.querySelector('.status-text').textContent = "Syncing...";
    }
    await setDoc(docRef, { state: updatedState }, { merge: true });
  } catch (err) {
    console.error("Cloud write failed:", err);
    showToast("Save to cloud failed. Saved to local browser cache instead.", "error");
  }
}

// 11. Coordinate Local & Cloud Saving Wrapper
function saveState() {
  // 1. Immediately cache in localStorage
  localStorage.setItem('aws-tracker-v4', JSON.stringify(state));
  updateProgress();
  
  // 2. Upload to Firestore
  if (docRef) {
    saveStateFirestore(state);
  } else {
    // Local mock or offline
    const syncStatus = document.getElementById('sync-status');
    if (syncStatus) {
      syncStatus.className = 'sync-status offline';
      syncStatus.querySelector('.status-text').textContent = firebaseConfig.apiKey === "YOUR_API_KEY" ? "Local Mock" : "Offline";
    }
    showToast("Progress saved to local browser cache", "success");
  }
}

// 12. Helper: Retrieve All Flattened Items from study DATA
function getAllItems() {
  const all = [];
  DATA.forEach(p => p.groups.forEach(g => g.days.forEach(d => d.items.forEach(i => all.push({...i, schedDate: d.date})))));
  return all;
}

// 13. Helper: Check Target Date and Completion State
function getDayStatus(day) {
  const today = new Date(); today.setHours(0,0,0,0);
  const sched = new Date(day.date + 'T00:00:00');
  const allDone = day.items.every(i => state[i.id]?.done);
  if (allDone) return 'done';
  if (sched.getTime() === today.getTime()) return 'today';
  if (sched < today) return 'overdue';
  return 'upcoming';
}

// 14. Helper: Custom Format Date display
function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-CA', {month:'short', day:'numeric'});
}

// 15. Update Progress Indicators & Dashboard Bar
function updateProgress() {
  const all = getAllItems();
  const done = all.filter(i => state[i.id]?.done).length;
  const pct = Math.round((done / all.length) * 100);
  
  const doneCountEl = document.getElementById('done-count');
  const totalCountEl = document.getElementById('total-count');
  const pctEl = document.getElementById('pct');
  const barEl = document.getElementById('bar');
  const daysLeftEl = document.getElementById('days-left');
  const onTrackEl = document.getElementById('on-track');
  
  if (doneCountEl) doneCountEl.textContent = done;
  if (totalCountEl) totalCountEl.textContent = all.length;
  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) barEl.style.width = pct + '%';
  
  const exam = new Date('2026-07-17T00:00:00');
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.ceil((exam - today) / (1000*60*60*24));
  
  if (daysLeftEl) {
    daysLeftEl.textContent = diff > 0 ? diff + ' days' : (diff === 0 ? 'Today!' : 'Passed!');
  }
  
  const dueItems = all.filter(i => { const s = new Date(i.schedDate+'T00:00:00'); return s <= today; });
  const dueItemsDone = dueItems.filter(i => state[i.id]?.done).length;
  
  if (onTrackEl) {
    if (dueItems.length === 0) { 
      onTrackEl.textContent = '✓ Yes'; 
      onTrackEl.style.color = 'var(--color-success)'; 
    } else if (dueItemsDone === dueItems.length) { 
      onTrackEl.textContent = '✓ Yes'; 
      onTrackEl.style.color = 'var(--color-success)'; 
    } else { 
      onTrackEl.textContent = `${dueItemsDone}/${dueItems.length}`; 
      onTrackEl.style.color = 'var(--color-danger)'; 
    }
  }
}

// 16. Generate and Render Main Layout Content
function render() {
  const container = document.getElementById('main-content');
  if (!container) return;
  
  container.innerHTML = '';
  
  DATA.forEach(phase => {
    const phaseEl = document.createElement('div');
    phaseEl.className = 'phase';
    let html = `<div class="phase-header">
      <div class="phase-dot" style="background:${phase.color}"></div>
      <div class="phase-title">${phase.label}</div>
      <div class="phase-dates">${phase.dates} · <em style="font-weight:400">${phase.note}</em></div>
    </div>`;
    
    phase.groups.forEach(group => {
      html += `<div class="group-label">${group.label}</div>`;
      
      group.days.forEach(day => {
        const dayStatus = getDayStatus(day);
        const allDone = day.items.every(i => state[i.id]?.done);
        
        let headerClass = '';
        let pillHtml = '';
        
        if (dayStatus === 'done') { 
          headerClass = 'done-day'; 
          pillHtml = `<span class="day-pill pill-done">✓ Done</span>`; 
        } else if (dayStatus === 'today') { 
          headerClass = 'today-day'; 
          pillHtml = `<span class="day-pill pill-today">Today</span>`; 
        } else if (dayStatus === 'overdue') { 
          headerClass = 'overdue-day'; 
          pillHtml = `<span class="day-pill pill-overdue">Overdue</span>`; 
        } else { 
          pillHtml = `<span class="day-pill pill-upcoming">${day.label}</span>`; 
        }
        
        html += `<div class="day-block ${allDone ? 'all-done' : ''}">
          <div class="day-header ${headerClass}">
            <span class="day-name">${day.label}</span>
            ${pillHtml}
          </div>`;
          
        day.items.forEach(item => {
          const done = state[item.id]?.done;
          const dateStr = done ? '✓ ' + formatDate(state[item.id].date) : (item.time !== '—' ? item.time : '—');
          
          html += `<div class="item-row ${done ? 'done' : ''}" onclick="openModal('${item.id}', '${day.date}', '${day.label}')">
            <div class="checkbox"><span class="checkmark">✓</span></div>
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-block">${item.block}</div>
            </div>
            <span class="item-tag tag-${item.tag}">${item.tag}</span>
            <div class="item-date ${done ? 'date-done' : 'date-pending'}">${dateStr}</div>
          </div>`;
        });
        html += `</div>`;
      });
    });
    
    phaseEl.innerHTML = html;
    container.appendChild(phaseEl);
  });
  
  updateProgress();
}

// 17. Interactive Modal Control Details
function openModal(id, schedDate, dayLabel) {
  activeId = id;
  const all = getAllItems();
  const item = all.find(i => i.id === id);
  if (!item) return;
  
  const s = state[id] || {};
  
  const titleEl = document.getElementById('modal-title');
  const metaEl = document.getElementById('modal-meta');
  const timeEl = document.getElementById('modal-time');
  const dateInput = document.getElementById('modal-date');
  const clearBtn = document.getElementById('modal-clear-btn');
  
  if (titleEl) titleEl.textContent = item.name;
  if (metaEl) metaEl.textContent = dayLabel;
  if (timeEl) timeEl.textContent = item.time !== '—' ? item.time : 'Full Day Rest';
  
  const today = new Date().toISOString().split('T')[0];
  if (dateInput) dateInput.value = s.date || today;
  
  if (clearBtn) {
    clearBtn.style.display = s.done ? 'inline-flex' : 'none';
  }
  
  const modalBg = document.getElementById('modal-bg');
  if (modalBg) {
    modalBg.classList.add('open');
  }
}

function closeModal() {
  const modalBg = document.getElementById('modal-bg');
  if (modalBg) {
    modalBg.classList.remove('open');
  }
  activeId = null;
}

function saveItem() {
  const dateInput = document.getElementById('modal-date');
  if (!dateInput) return;
  
  const date = dateInput.value;
  if (!date) {
    showToast("Please choose a valid completion date", "warning");
    return;
  }
  
  state[activeId] = { done: true, date };
  saveState();
  render();
  closeModal();
}

function clearItem() {
  if (activeId) {
    delete state[activeId];
    saveState();
    render();
  }
  closeModal();
}

function resetAll() {
  if (confirm('Are you absolutely sure you want to reset all progress? This action is permanent and cannot be undone.')) {
    state = {};
    saveState();
    render();
  }
}

// 18. Bind Functions Globally for HTML compatibility (needed since this is an ES Module)
window.openModal = openModal;
window.closeModal = closeModal;
window.saveItem = saveItem;
window.clearItem = clearItem;
window.resetAll = resetAll;

// 19. Initialize Event Hooks on DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Bind Static DOM Elements
  const modalBg = document.getElementById('modal-bg');
  const modalCloseX = document.getElementById('modal-close-x-btn');
  const modalCancel = document.getElementById('modal-cancel-btn');
  const modalSave = document.getElementById('modal-save-btn');
  const modalClear = document.getElementById('modal-clear-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  if (modalBg) {
    modalBg.addEventListener('click', (e) => {
      if (e.target === modalBg) closeModal();
    });
  }
  
  if (modalCloseX) modalCloseX.addEventListener('click', closeModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modalSave) modalSave.addEventListener('click', saveItem);
  if (modalClear) modalClear.addEventListener('click', clearItem);
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  
  // Run Main Boot sequence
  initApp();
});

// 20. Main App Boot Sequence
async function initApp() {
  const loadingText = document.getElementById('loading-text');
  
  // Detect placeholder credentials
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    fallbackToLocal("Firebase credentials not configured.");
    return;
  }

  try {
    if (loadingText) loadingText.textContent = "Connecting to cloud data infrastructure...";
    
    // Initialize Firebase client
    app = initializeApp(firebaseConfig);
    
    // Initialize Firestore with robust local persistent cache
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });

    if (loadingText) loadingText.textContent = "Synchronizing progress database...";
    
    // Boot listeners directly without auth
    setupConnectionState();
    setupRealtimeSync();

  } catch (err) {
    console.error("Firebase startup sequence aborted:", err);
    fallbackToLocal("Firebase startup sequence aborted.");
  }
}
