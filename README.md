# AI Study Companion

AI Study Companion is a production-ready React application for students who want to manage subjects, log study sessions, monitor progress, and generate quick AI-powered summaries for revision.

## Tech Stack

- React with Vite
- React Router
- Firebase Authentication
- Firestore Database
- Tailwind CSS

## Features

- Email/password signup and login
- Protected dashboard and subject routes
- User-specific subject CRUD with Firestore
- Study session tracking by subject
- Aggregate progress stats on the dashboard
- AI summary generator with a reliable mock fallback
- Responsive UI with loading and error states

## Project Structure

```text
src/
  components/
  context/
  hooks/
  pages/
  services/
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/.
2. Add a Web app to the project.
3. Enable `Authentication` and turn on the `Email/Password` provider.
4. Create a Firestore database in production or test mode.
5. Copy `.env.example` to `.env.local`.
6. Paste your Firebase values into `.env.local`.

Example:

```bash
cp .env.example .env.local
```

## Recommended Firestore Structure

```text
users/{uid}/subjects/{subjectId}
users/{uid}/subjects/{subjectId}/sessions/{sessionId}
```

Each subject document stores:

- `title`
- `description`
- `createdAt`
- `updatedAt`
- `sessionCount`
- `totalDuration`

Each session document stores:

- `date`
- `duration`
- `notes`
- `createdAt`

## Firestore Rules Starter

Use rules like these so each user can access only their own data:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Install And Run

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Notes

- If Firebase config is missing, the UI still loads and shows setup guidance.
- The AI summary feature currently uses a mock generator so the app remains functional without an external API.

