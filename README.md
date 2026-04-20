# AI Study Companion

A React app for students to manage subjects, log study sessions, track progress, and generate AI-powered summaries for revision.

## Tech Stack

- React + Vite
- React Router
- Firebase Authentication & Firestore
- Tailwind CSS
- Groq API (`llama-3.3-70b-versatile`) for AI summaries

## Features

- Email/password signup and login
- Subject CRUD with per-user Firestore storage
- Study session logging per subject
- Aggregate progress stats on the dashboard
- AI summary generator with optional custom Groq API key

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your Firebase config and Groq API key:

```bash
cp .env.example .env.local
```

### 3. Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add a Web app and copy the config values into `.env.local`
3. Enable **Authentication → Email/Password**
4. Create a **Firestore** database

### 4. Run

```bash
npm run dev
```

```bash
npm run build   # production build
```

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Notes

- If Firebase config is missing the app still loads and shows setup guidance.
- The AI summary feature uses the [Groq API](https://console.groq.com/). A default key is set via `VITE_GROQ_API_KEY` in `.env.local`, or users can enter their own key directly in the Summary page UI.
