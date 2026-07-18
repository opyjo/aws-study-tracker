# Cloudline — AWS SAA-C03 Study Tracker

A focused, responsive study tracker for the AWS Certified Solutions Architect – Associate exam on **September 5, 2026**.

## What is included

- A complete 49-day plan from July 18 through exam day
- The original five-stage practice flow: topic-based tests, Review Mode, Timed Mode, section-based tests, and consolidation
- A focused “today” view with session duration and next action
- Full mock exams, domain drills, review days, and protected rest
- Completion dates, optional practice scores, and private study notes
- Readiness estimates for all four SAA-C03 domains
- Real-time Firestore sync with a device-local fallback
- Responsive desktop and mobile layouts

The September plan uses its own storage key and Firestore document, so progress from the previous July schedule is not carried forward.

## Run locally

Serve the directory with any static web server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Data and sync

Progress is written to the `trackers/september-5-2026` Firestore document and mirrored to local storage. If Firestore cannot be reached, the tracker continues to work on the current device.
