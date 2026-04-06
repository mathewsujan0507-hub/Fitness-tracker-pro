# FitTrack Pro (Short)

## What it is
FitTrack Pro is a lightweight, offline-friendly fitness tracker built with **HTML + CSS + JavaScript**. It helps you:

- Plan workouts from a built-in exercise library
- Run timed workout sessions (exercise + rest)
- Track progress (workout count, time, calories estimate, streak)
- Keep history, water intake, and steps
- Toggle dark mode

## How it works (quick)
- **Data storage**: browser `localStorage`
- **Planner**: saves selected workout plans to `localStorage.plans`
- **Session**: reads `localStorage.activePlan` and runs a timer per exercise/set, saving results to history
- **Progress**: charts workout trend and totals
- **Auth**: simple login/signup stored in `localStorage` (demo/offline authentication)

## Pages
- `login.html`, `signup.html`: authentication pages
- `index.html`: dashboard
- `library.html`: workout templates (beginner/advanced)
- `planner.html`: saves chosen plans and starts a session
- `session.html`: workout timer + exercise animation
- `progress.html`: charts
- `history.html`: workout log
- `settings.html`: Spotify link + reset data

## Version
- **v1.1**: adds login/signup + exercise animation in session

