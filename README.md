# AWS SAA-C03 Study Tracker (Firebase & Offline Enabled)

A beautiful, premium study tracker for the AWS Certified Solutions Architect - Associate (SAA-C03) exam. Rebuilt with a Firebase Firestore backend, anonymous authentication, offline synchronization support, and a polished modern interface.

## Features

- **Anonymous Authentication**: Silent login on first load; progress automatically synced to a unique ID.
- **Real-Time Sync**: Real-time sync across device screens using Firestore `onSnapshot`.
- **Offline Support**: Leverages Firestore's native offline capabilities and falls back to a dual-layered `localStorage` sync if offline on init.
- **Sync Status & Network Indicator**: Interactive, animated badge displaying `Syncing...`, `Synced`, or `Offline`.
- **Interactive Toasts**: Clean micro-animated notifications for saves, offline warnings, and cache updates.
- **Frictionless UI**: Gorgeous modern typography (Inter & Outfit fonts), custom dark-accent styling, cards, smooth modals, and responsive layout.

---

## Getting Started & Setup

To get this tracker up and running with your own Firebase database, follow these steps:

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the instructions to create a new project (e.g. `aws-study-tracker`).
3. You can disable Google Analytics if you'd like.

### 2. Enable Anonymous Authentication
1. In the Firebase Console left menu, navigate to **Build** > **Authentication**.
2. Click **Get Started**.
3. In the **Sign-in method** tab, click **Anonymous** under *Additional providers*.
4. Toggle the **Enable** switch and click **Save**.

### 3. Create a Firestore Database
1. In the Firebase Console left menu, navigate to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Select your preferred database location and click **Next**.
4. Start in **Production mode** (we will apply security rules next) or **Test mode**.
5. Click **Create**.

### 4. Configure Security Rules
1. In the Firestore page, go to the **Rules** tab.
2. Copy and paste the contents of `firestore.rules` (shown below) into the rules editor:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /trackers/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
3. Click **Publish**.

### 5. Obtain Firebase Config and Paste
1. Go back to your Firebase Console **Project Overview** page.
2. Click the **Web** icon (`</>`) to add an app.
3. Enter an app nickname (e.g. `aws-tracker`) and click **Register app**.
4. You will see a `firebaseConfig` object. It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
5. Open `app.js` in your project folder.
6. Replace the placeholder config at the top of `app.js` with your actual credentials.

---

## Local Development & Deployment

To open the app locally, simply run a local HTTP server inside this directory. For example, using Python or Node.js:

```bash
# Using Python (built-in)
python3 -m http.server 8000

# Using Node.js npx (if installed)
npx serve .
```

Then visit `http://localhost:8000` (or `http://localhost:3000`) in your browser. You can host this complete set of static files on free hosts like **Vercel**, **Netlify**, or **Firebase Hosting**.

Enjoy your studying, and good luck on the AWS SAA-C03 Exam! 🚀
