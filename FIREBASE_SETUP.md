# Puppy Panel Firebase setup

## 1. Create Firebase
Go to https://console.firebase.google.com and create a project. Google Analytics is optional.

## 2. Register a Web App
Project Overview → Web (`</>`) → register app. Copy the Firebase config values into `firebase-config.js`.

## 3. Authentication
Build → Authentication → Get started → Sign-in method → Email/Password → Enable.

Authentication → Users → Add user. Create exactly two accounts: one Owner and one Puppy. Copy each UID.

## 4. Firestore
Build → Firestore Database → Create database → Production mode.

Create collection `users`. Create a document whose ID is the Owner UID with field `role` (string) = `owner`.
Create another document whose ID is the Puppy UID with field `role` (string) = `puppy`.

Firestore → Rules: replace everything with `firestore.rules` and Publish.

## 5. Storage for photos
Build → Storage → Get started. Then Storage → Rules: replace everything with `storage.rules` and Publish.

## 6. GitHub
Upload/replace the website files in your `puppypannel` repository. In particular, make sure these are present at the repository root:

- index.html
- styles.css
- app.js
- firebase-config.js
- manifest.json
- sw.js
- icons/icon.svg

The `.rules` files do not need to be public on GitHub; you can keep them locally after pasting their contents into Firebase.

## 7. Test
Open https://isaac3244.github.io/puppypannel/

Choose Owner and sign in with the Owner account. The first Owner login seeds the shared app data. Then sign in as Puppy on the second device/browser.

## Privacy
Diary entries are stored separately from shared dashboard data. Owner queries can only read entries marked `shared: true`; Puppy can read their own entries. Passwords are handled by Firebase Authentication and never belong in GitHub.
