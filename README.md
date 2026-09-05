# Puppy Panel

A mobile-first pastel relationship dashboard built as a static web app.

## What is included

- Separate Owner and Puppy demo entry screens
- Puppy dashboard with tasks, Paw Points, mood check-ins, diary, calendar, streaks, photos, reward shop
- Owner dashboard with task/reward management, point adjustments, consequences, activity and reward approvals
- Daily messages
- Countdowns
- Wish list
- Love notes
- Rotating daily prompts
- Special quests
- Achievements/badges
- Memory gallery
- Random treat picker
- Weekly recap
- Profile customization
- Full appearance editor and preset themes
- Night mode
- PWA manifest + service worker for install-like behavior
- Mobile responsive layout

## Run locally

Because the service worker needs HTTP, use a simple local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also open `index.html` directly for most features, but PWA caching will not work from `file://`.

## GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save.

## Important privacy note

This starter version stores data in the browser with `localStorage`. That is intentional so the project can run immediately with no backend setup.

It is **not appropriate for private diary data or real authentication** yet. A real deployment for two people should connect the UI to Firebase or Supabase and enforce account roles server-side.

Do not place real passwords in `app.js`.

## Recommended Firebase upgrade

Use:
- Firebase Authentication: Owner and Puppy accounts
- Cloud Firestore: tasks, diary, moods, points, settings
- Cloud Storage: photos
- Firestore/Storage rules: enforce `owner` vs `puppy` access

The UI is already separated by `state.session.role`, so replacing localStorage reads/writes with Firebase calls is the next logical step.
