# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Evolve:Breath** is a Progressive Web App (PWA) designed for people with CFS/ME (Chronic Fatigue Syndrome/Myalgic Encephalomyelitis). It guides users through breathing exercises tailored to their current energy level. The entire application lives in a single `index.html` file with embedded CSS and JavaScript — there is no build system, no bundler, and no package.json.

## Running Locally

```bash
python3 -m http.server 8000
# or
npx serve
```

HTTPS is required for Service Workers and Firebase Auth to work. For local development, `localhost` is treated as secure by browsers, so `http://localhost:8000` works fine.

There are no automated tests. Manual testing covers audio playback, Firestore sync (including offline→online transitions), service worker caching, session migration, and reminder notifications.

## Deploying / Cache Busting

When assets change, increment the cache version in `sw.js` line 6:
```javascript
var CACHE_VERSION = 7; // bump this number
```
This forces all clients to refetch cached assets on next visit.

## Architecture

### File Structure

```
index.html            # Entire app — HTML, CSS, and JS (~2656 lines)
sw.js                 # Service Worker (cache-first strategy, ~63 lines)
manifest.json         # PWA manifest
icon-192.png          # App icon
icon-512.png          # Splash screen icon
evolve-breath.html    # Older backup copy of the app (not served — do not edit)
```

`evolve-breath.html` is an earlier version of the app kept for reference. It lacks the onboarding screens, sound selector, arc-based practice screen, and suggest feature. All development happens in `index.html`.

### Navigation Model

The app is a set of named `<div>` screens toggled with the `active` CSS class via the `show(id)` function. There is no router. All screens have `id="screen-<name>"` and `class="screen"`. Back navigation uses `goBack(to)` which simply calls `show(to)`.

### Screens

| Screen ID     | Purpose                                         |
|---------------|-------------------------------------------------|
| `onboard`     | 3-slide first-run onboarding (shown once only)  |
| `auth`        | Sign-in / create account / guest access         |
| `energy`      | Home — energy level selection (Flare/Moderate/Good) |
| `goal`        | Goal selection (depends on energy level)        |
| `time`        | Duration selection                              |
| `drills`      | Drill selection                                 |
| `practice`    | Breathing session — arc animation + audio       |
| `complete`    | Post-session completion screen                  |
| `history`     | Session history & data export                   |
| `reminders`   | Reminder times & ambient sound settings         |
| `resources`   | Educational articles and guides                 |
| `suggest`     | Feature suggestion (embedded iframe form)       |
| `profile`     | User profile view                               |
| `privacy`     | Privacy policy                                  |

### Session State

All in-flight session state lives in a single global object `S`:

```javascript
S = {
  energy,            // 'flare' | 'moderate' | 'good'
  goal,              // selected goal name
  goalCat,           // internal category (e.g. 'DOWN_REGULATION')
  time,              // duration key: '1' | '2' | '1-2' | '5' | '10'
  timeLabel,         // display string e.g. "5 minutes"
  drill,             // drill object {name, rounds, instr, rec}
  totalRounds, currentRound,
  phases,            // array of {p: phase-name, s: seconds}
  phaseIdx,
  lastPhaseWasInhale,// tracks phase transition for audio
  started, paused,
  breathTimer, cdTimer  // setInterval IDs
}
```

### User Flow

```
First visit:  Onboarding (3 slides) → Auth screen → Energy selection → ...
Return visit: Auth screen (skip onboarding) → Energy selection → ...

Main flow:
Energy selection → Goal selection → Time selection → Drill selection
→ 10s countdown → Breathing loop (visual arc + audio) → Complete screen → Home
```

Onboarding completion sets `eb_onboarded` in localStorage and redirects to `screen-auth`. Auth state changes (via `onAuthStateChanged`) then redirect to `screen-energy` on login, or back to `screen-auth` on logout.

### Data Persistence

- **localStorage** (offline fallback):
  - `evolve_history` — array of session objects
  - `evolve_reminders` — `{ morning: "HH:mm", evening: "HH:mm" }`
  - `eb_onboarded` — `'1'` once onboarding has been seen
  - `eb_sound` — ambient sound preference (`'off'|'rain'|'bowls'|'drone'|'nature'`)
- **Firestore** (cloud, when logged in): `users/{uid}` + `users/{uid}/sessions` sub-collection
- On first sign-in, local sessions are batch-migrated to Firestore (`migrated` flag prevents re-migration)

### Firestore Schema

```
/users/{uid}
  displayName, email, createdAt, migrated
  reminders: { morning: "HH:mm", evening: "HH:mm" }
  wake: "HH:mm", sleep: "HH:mm"
  /sessions/{docId}
    drill, rounds, goal, energy, timeLabel, ts (unix ms)
```

### Goals & Categories

Goals are defined in the `GOALS` object, keyed by energy level. Each goal maps to an internal `cat` string:

| Category            | Flare label       | Moderate label       | Good label          |
|---------------------|-------------------|----------------------|---------------------|
| `DOWN_REGULATION`   | Calm Down         | Down-Regulation      | Down-Regulation     |
| `COGNITIVE_CALMING` | Clear Mind        | Cognitive Calming    | —                   |
| `COGNITIVE_FOCUS`   | —                 | —                    | Cognitive Focus     |
| `QUICK_RESET`       | Quick Rebalance   | Quick Rebalance      | Quick Rebalance     |
| `SLEEP`             | Sleep / Wind-Down | Sleep / Wind-Down    | Sleep / Wind-Down   |
| `PRE_EXERCISE`      | Pre-Exercise      | Pre-Exercise         | Pre-Exercise        |
| `POST_EXERCISE`     | Post-Exercise     | Post-Exercise        | Post-Exercise       |

Goals marked `full:true` in the `GOALS` array render as full-width cards in the UI.

### Drill / Goal Data Structures

Drills are defined in the `DRILLS` object, keyed by `energy → goalCat → timeKey → array`:

```javascript
DRILLS['flare']['DOWN_REGULATION']['1'] = [
  {name: 'Soft Sigh Exhale', rounds: '10 rounds', rec: true,  instr: '...'},
  {name: '3/5 Downshift',    rounds: '7-8 rounds', rec: false, instr: '...'}
]
```

Available time keys per energy level are in `TIME_MAP`:

```javascript
TIME_MAP = {
  flare:    ['1', '2'],
  moderate: ['1-2', '5', '10'],
  good:     ['1-2', '5', '10']
}
```

Phase timing patterns are in `PHASE_PATTERNS`, keyed by drill name. Phase names (`p`) are not limited to `Inhale/Hold/Exhale` — drills also use `'Sigh out'`, `'Hum out'`, `'Belly in'`, `'Ribs & chest'`, `'Inhale & expand'`, `'Exhale & return'`, `'Inhale steps'`, `'Exhale steps'`:

```javascript
PHASE_PATTERNS['Box Breathing'] = [
  {p:'Inhale',s:4}, {p:'Hold',s:4}, {p:'Exhale',s:4}, {p:'Hold',s:4}
]
PHASE_PATTERNS['Soft Sigh Exhale'] = [
  {p:'Inhale',s:3}, {p:'Sigh out',s:4}
]
```

The practice screen renders the current phase name as-is from the `p` field and uses the `s` value for the arc timer.

### Audio Engine

All audio is synthesized via the Web Audio API — there are no audio files. The breathing-cue `AudioContext` (stored in `_ctx`) is created on first user tap to comply with browser autoplay policies. A separate `AudioContext` (`_ambientCtx`) handles ambient sounds.

**Breath-cue tone frequencies:**

| Phase   | Frequency   | Notes                      |
|---------|-------------|----------------------------|
| Inhale  | 196 Hz (G3) | Detuned chorus effect       |
| Exhale  | 165 Hz (E3) | Descending pitch contour    |
| Hold    | 196 Hz (G3) | Steady sine                 |
| Hum     | 123 Hz (B2) | LFO-modulated               |
| Tick    | 320→240 Hz  | Countdown guide clicks      |

**Ambient sounds** (stored as `_ambientChoice`):

| Value    | Sound                                     |
|----------|-------------------------------------------|
| `'off'`  | No ambient sound (default)                |
| `'rain'` | Synthesized rain/white noise              |
| `'bowls'`| Singing bowl tones (interval-triggered)   |
| `'drone'`| Low continuous drone                      |
| `'nature'`| Nature soundscape with random chirps     |

Ambient sound preference is persisted in `eb_sound` (localStorage) via `selectSound()` and loaded on startup via `loadSoundPref()`. The mute button (`#mute-btn`) in the practice screen reflects the current choice.

### Practice Screen

The practice screen uses an SVG arc (`<path class="arc-progress">`) that animates over the phase duration — progress is set by `setArcProgress(pct)`. The center of the arc displays the current phase name and a countdown timer. On completion `completePractice()` calls `saveSession()` then navigates to `screen-complete`.

### Reminders

A `setInterval` runs every 30 seconds calling `checkReminders()`, which compares the current `HH:mm` against user-stored morning/evening times. Reminder prefs are stored in both Firestore and localStorage.

### Authentication

Firebase Auth (Google Sign-in + email/password) is used. Firebase SDKs are loaded synchronously in the `<body>` just before the app `<script>` block (lines 1264–1267 in index.html). The `auth` and `db` globals are initialised immediately after; if Firebase fails to load they fall back to `null` and the app runs in guest mode. Auth panel switching (`sign-in` / `create` tabs) is handled by `showAuthPanel(panel)`.

## Key Conventions

- **ES5 JavaScript** — no arrow functions, no `const`/`let`, no modules. Keep new code consistent with the surrounding style.
- **CSS variables** are defined in `:root`. Full list of key vars:
  - Colors: `--navy` (#2f354a), `--coral` (#fd6f15), `--teal` (#fd6f15, same as coral), `--sky` (#a0a0c0), `--bg` (#e8f2fb)
  - Light variants: `--teal-lt`, `--teal-bg`, `--sky-bg`, `--coral-bg`, `--navy-lt`, `--mist`
  - Text: `--text`, `--text-lt`
  - Phase colors: `--inhale` (#FFB347), `--exhale` (#6B8CAE), `--hold` (#9B8EC4)
  - Layout: `--radius` (16px)
  - Note: `--teal` and `--coral` are intentionally the same value — the brand color is orange (#fd6f15), not teal.
- **Screen IDs** follow `screen-<name>` — check `show('...')` calls before adding new screens.
- All Firestore writes should gracefully degrade when offline; wrap in `.catch()` that falls back to localStorage.
- The Firebase config (API key etc.) in `index.html` is a public client-side config — this is intentional for Firebase web apps and not a secret.
- The `show(id)` function removes `active` from all `.screen` elements then adds it to `#screen-{id}`. Never manipulate screen visibility any other way.
