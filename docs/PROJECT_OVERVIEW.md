# FitTrack Pro (Detailed)

## 1) Project Summary
FitTrack Pro is a front-end only fitness tracker application designed to run entirely in the browser. It uses:

- **Static pages** (`.html`)
- A shared **stylesheet** (`css/style.css`)
- Page-specific **JavaScript** modules in `js/`
- **localStorage** for persistence (plans, settings, history, auth state)
- Optional **PWA pieces** (`manifest.json`, `service-worker.js`)

It’s intended to be simple to run (open `index.html` in a browser) while still offering a realistic “fitness tracker” experience: planning workouts, running timed sessions, logging results, and viewing analytics.

## 2) Tech Stack
- **HTML/CSS/JavaScript** (no framework)
- **Chart.js** via CDN on `progress.html`
- **Browser APIs**:
  - `localStorage` for persistence
  - `navigator.serviceWorker` registration (basic)

## 3) Data Model (localStorage)
FitTrack Pro stores data in the browser to keep the app offline-capable and easy to demo.

### Core keys
- **`theme`**: `"dark"` or `"light"` for dark mode (set in `js/main.js`)
- **`plans`**: array of saved plans for Planner
  - shape:
    - `{ name: string, level: "Beginner"|"Advanced", exercises: [{ name: string, scheme: string }] }`
- **`activePlan`**: the plan currently in session (set by Planner, read by Session)
- **`history`**: array of completed workouts
  - shape:
    - `{ date: string, time: number }` where `time` is seconds
- **`totalWorkouts`**: number
- **`totalTime`**: total workout time in seconds
- **`water`**: number/string (ml)
- **`steps`**: number/string
- **`spotify`**: preferred playlist URL (settings page)

### Auth keys (added in v1.1)
Auth is intentionally lightweight (demo/offline auth).
- **`ft_users`**: array of users
  - `{ email: string, password: string, createdAt: string }`
- **`ft_currentUser`**: current user email (string)
- **`ft_redirectAfterLogin`**: page URL to return to after login

## 4) Pages and Responsibilities

### `login.html`
- Lets a user login with email/password.
- On success: sets `ft_currentUser` and redirects to the original requested page or `index.html`.

### `signup.html`
- Creates a new user in `ft_users`.
- On success: logs in immediately and redirects to `index.html`.

### `index.html` (Dashboard)
Shows summary cards and daily trackers:
- Total workouts
- Calories estimate (simple formula)
- Total time trained
- Weekly streak
- Water intake and steps inputs

**JS**:
- `js/main.js`: dark mode toggle
- `js/auth.js`: requires login + shows nav user/logout
- `js/dashboard.js`: loads totals and trackers

### `library.html` (Exercise Library)
Contains prebuilt “workouts” (chest, back, biceps, etc.). Each workout provides a beginner and advanced routine with:
- `name`
- `scheme` (sets/reps format)
- `description` (how to do it)

Selecting a plan level shows the routine and offers “Add to Planner”.

**JS**:
- `js/library.js`: workout definitions + plan preview + add-to-planner

### `planner.html` (Workout Planner)
Planner lists saved plans and allows:
- selecting a plan template from the library
- starting a plan (which stores `activePlan` and goes to Session)
- deleting a plan

**JS**:
- `js/planner.js`: loads/saves plans, plan picker UI, start/delete actions

### `session.html` (Workout Session)
Runs the timed workout session using:
- A phase model: `idle → work → rest → finished`
- Set counting based on `scheme` parsing
- Per-exercise durations depending on level (beginner/advanced) with defaults
- Rest config per set vs between exercises

It now also includes an **exercise animation panel**:
- Loops while the timer runs
- Automatically switches animation when exercise changes
- Shows a “rest pulse” animation during rest

**JS**:
- `js/session.js`: session state machine, timer logic, history saving, animation mapping

### `progress.html`
Shows analytics charts using Chart.js:
- Weekly trend
- Lifetime summary

**JS**:
- `js/progress.js` + Chart.js CDN

### `history.html`
Displays workout history from `localStorage.history` and can clear it.

**JS**:
- `js/history.js`

### `settings.html`
Allows storing a Spotify playlist link and resetting all data.

**JS**:
- `js/settings.js`

## 5) Session Timer Logic (How it advances)
During a session, the app:
1. Loads `activePlan` from localStorage
2. Starts exercise work timer for set 1 of exercise 1
3. When time hits 0:
   - Offers “extra rest” (optional)
   - Then moves to rest timer
4. Rest completion advances either:
   - next set of same exercise, or
   - next exercise (and resets set count)
5. Finishing the plan saves:
   - `totalWorkouts += 1`
   - `totalTime += durationSeconds`
   - appends to `history`

## 6) Versioning
### v1.1 (current)
- Added `login.html` and `signup.html`
- Added `js/auth.js` with route guarding + navbar login/logout UI
- Added exercise animation panel on `session.html` driven by the current exercise name

### v1.0
- Dashboard, Planner, Library, Session timer, Progress charts, History, Settings, Dark mode

## 7) Running the Project
1. Open `login.html` (or `index.html`) in a browser.
2. Create an account on **Sign Up**.
3. Use **Library → Add to Planner**.
4. Use **Planner → Start** to begin a session.

Tip: because it’s static, you can run it via any local server too (recommended for service worker behavior).

