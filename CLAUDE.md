# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Evolve:Breath** is a Progressive Web App (PWA) designed for people with CFS/ME (Chronic Fatigue Syndrome/Myalgic Encephalomyelitis). It guides users through breathing exercises tailored to their current energy level. The entire application lives in a single `index.html` file (~2,656 lines) with embedded CSS and JavaScript — there is no build system, no bundler, and no package.json.

## Running Locally

```bash
python3 -m http.server 8000
# or
npx serve
```

HTTPS is required for Service Workers and Firebase Auth to work. For local development, `localhost` is treated as secure by browsers, so `http://localhost:8000` works fine.

There are no automated tests. Manual testing covers audio playback, Firestore sync (including offline→online transitions), service worker caching, session migration, reminder notifications, ambient sounds, and onboarding.

## Deploying / Cache Busting

When assets change, increment the cache version in `sw.js` line 6:
```javascript
var CACHE_VERSION = 7; // bump this number
```
This forces all clients to refetch cached assets on next visit.

## Architecture

### File Structure

```
index.html          # Entire app — HTML, CSS, and JS (~2,656 lines, 84 functions)
evol-breath.html    # Earlier backup snapshot (pre-ambient-sound, 2,175 lines)
sw.js               # Service Worker (cache-first strategy, ~63 lines)
manifest.json       # PWA manifest
icon-192.png        # App icon
icon-512.png        # Splash screen icon
```

`evolve-breath.html` is a backup of the codebase taken before the ambient sound system, onboarding flow, arc animation, and mobile Google auth redirect were added. It lacks `finishOnboard`, `handleGoogleRedirect`, `setArcProgress`, and all ambient sound functions. Do not edit it unless specifically asked — treat it as a rollback reference.

### Navigation Model

The app is a set of 14 named `<div>` screens toggled with `display` via the `show(id)` function. There is no router.

Available screen IDs passed to `show()`:
```
auth, complete, drills, energy, goal, history, practice,
privacy, profile, reminders, resources, suggest, time
```

The `onboard` screen (`screen-onboard`) is the initial visible screen but is never targeted by `show()` — it is left by calling `finishOnboard()` which calls `show('energy')`. Back navigation uses `goBack(targetId)`, which is simply `show(targetId)` with an explicit destination — there is no `_history` stack.

### Session State

All in-flight session state lives in a single global object `S`:

```javascript
var S = {
  energy,           // 'flare' | 'moderate' | 'good'
  goal,             // selected goal name (display string)
  goalCat,          // internal category constant (e.g. DOWN_REGULATION)
  time,             // duration key: '1' | '2' | '1-2' | '5' | '10'
  timeLabel,        // display string e.g. "5 minutes"
  drill,            // drill object {name, rounds, instr, rec}
  totalRounds,      // number
  currentRound,     // number
  phases,           // array of {p: string, s: seconds}
  phaseIdx,         // current index into phases[]
  started,          // boolean
  paused,           // boolean
  breathTimer,      // setInterval ID
  cdTimer           // setInterval ID (countdown)
  // runtime-only (not in literal):
  // lastPhaseWasInhale  — boolean, set in setupPractice(), toggled in runPhase()
  //                       determines expand vs contract hold visual state
}
```

### User Flow

```
[First visit] Onboarding (3 slides) → finishOnboard()

Energy selection → Goal selection → Time selection → Drill selection
  → 10s countdown → Breathing loop (visual + audio) → Save session → Home
```

### Onboarding

Shown on first visit when `localStorage.getItem('eb_onboarded')` is falsy. Three slides managed by `nextOnboard(slide)`. Completed by `finishOnboard()` which sets `eb_onboarded` in localStorage and calls `show('energy')`.

### Data Persistence

- **localStorage** (offline):
  - `evolve_history` — array of session objects (up to 100 entries, JSON)
  - `evolve_reminders` — `{morning, evening, wake, sleep}` times as `"HH:mm"`
  - `eb_onboarded` — `"1"` after onboarding is completed
  - `eb_sound` — ambient sound choice: `'off' | 'drone' | 'bowls' | 'rain' | 'nature'`
- **Firestore** (cloud, when logged in): `users/{uid}` + `users/{uid}/sessions` sub-collection
- On first sign-in, local sessions are batch-migrated to Firestore (`migrated` flag on the user doc prevents re-migration)

### Firestore Schema

```
/users/{uid}
  displayName   string
  email         string
  createdAt     serverTimestamp
  migrated      boolean          — set to true after local→Firestore migration
  reminders: {
    morning:  "HH:mm" | null
    evening:  "HH:mm" | null
    wake:     "HH:mm" | null
    sleep:    "HH:mm" | null
  }
  /sessions/{docId}
    drill       string
    rounds      number
    goal        string
    energy      string
    timeLabel   string
    ts          number  (unix ms)
```

> Note: `wake` and `sleep` are nested inside the `reminders` map — they are **not** top-level fields on the user document.

All Firestore writes must gracefully degrade when offline; wrap in `.catch()` that falls back to localStorage.

### Firebase SDK

- Version: **10.12.0** (compat mode)
- Scripts: `firebase-app-compat.js`, `firebase-auth-compat.js`, `firebase-firestore-compat.js`
- Auth methods: email/password + Google (uses `signInWithRedirect` + `getRedirectResult` — not popup, for mobile compatibility). `handleGoogleRedirect()` is called on page load to capture the redirect result.
- The Firebase config (API key etc.) in `index.html` is a public client-side config — intentional for Firebase web apps and not a secret.

### Audio Engine

All audio is synthesized via the Web Audio API — there are no audio files. The `AudioContext` is created on first user tap to comply with browser autoplay policies.

**Phase tones** (via `getSoundForPhase(phaseLabel)` — matches by substring):

| Phase label contains | Type | Effective frequency | Notes |
|---------------------|------|--------------------|---------|
| `'inhale'`, `'belly'`, `'ribs'`, `'expand'` | inhale | 196 Hz (G3) + 196.6 Hz | Two detuned sines (chorus effect) |
| `'hold'` | hold | 196 Hz + 196.6 Hz | `playTone('hold',…)` hardcodes these; the 55 Hz passed in is ignored |
| `'hum'`, `'sigh'` | hum | 123 Hz (B2) | Sine with LFO vibrato at 3.0 Hz, ±0.8 Hz deviation |
| anything else | exhale | 165 Hz (E3) | Single sine, pitch descends to 88% by end of phase |

**Countdown ticks**: frequency = `320 - (10 - n) * 8`, minimum 180 Hz. Actual range: 320 Hz at count 10 → 248 Hz at count 1.

**Ambient sounds** (managed by `_ambientCtx`, `_ambientNodes`, `_ambientGain`):

| Option | Builder function | Description |
|--------|-----------------|-------------|
| `drone` | `buildDrone()` | Layered sine oscillators |
| `bowls` | `buildBowls()` | Singing bowl frequencies: 174, 285, 396, 417, 528 Hz (randomized intervals) |
| `rain` | `buildRain()` | White noise → bandpass (400 Hz, Q=0.5) + lowpass (3000 Hz) |
| `nature` | `buildNature()` | Lowpass-filtered wind noise + random bird chirps (2000–3500 Hz) |

Ambient gain ramps to 0.18 over 2 s on start; fades over 1.5 s on stop. Preference saved as `eb_sound` in localStorage. Internal timer handles bowl/chirp chains (`_bowlTimer`, `_chirpTimer`) — `stopAmbient()` clears both to prevent leaks on pause/resume.

### Drill / Goal Data Structures

Goal categories (constants defined at top of JS):

```
DOWN_REGULATION   COGNITIVE_CALMING   COGNITIVE_FOCUS
QUICK_RESET       SLEEP               PRE_EXERCISE
POST_EXERCISE     MOVEMENT
```

`GOALS` object maps energy level to the list of goals shown in the UI:
- `flare` / `moderate` → `[DOWN_REGULATION, COGNITIVE_CALMING, QUICK_RESET, SLEEP, PRE_EXERCISE, POST_EXERCISE]`
- `good` → `[DOWN_REGULATION, COGNITIVE_FOCUS, QUICK_RESET, SLEEP, PRE_EXERCISE, POST_EXERCISE]`

`MOVEMENT` exists in `DRILLS` for `moderate`/`good` but is absent from `GOALS` — currently unreachable in the UI.

`DRILLS` is keyed by energy level → time key → goal category → array of drill objects `{name, rounds, instr, rec}`.

Time keys per energy level:
- `flare`: `'1'`, `'2'`
- `moderate` / `good`: `'1-2'`, `'5'`, `'10'`

Phase timing patterns are in `PHASE_PATTERNS`, keyed by drill name. Phase labels (`p`) can be non-standard strings — `getSoundForPhase()` uses substring matching:

```javascript
var PHASE_PATTERNS = {
  'Soft Sigh Exhale':      [{p:'Inhale',s:3}, {p:'Sigh out',s:4}],
  '3/5 Downshift':         [{p:'Inhale',s:3}, {p:'Exhale',s:5}],
  'Normalise Breath':      [{p:'Inhale',s:3}, {p:'Exhale',s:3}],
  'Micro-Holds':           [{p:'Inhale',s:3}, {p:'Hold',s:2}, {p:'Exhale',s:4}],
  '3-3-6 Reset':           [{p:'Inhale',s:3}, {p:'Hold',s:3}, {p:'Exhale',s:6}],
  'One-Minute Calm':       [{p:'Inhale',s:4}, {p:'Exhale',s:6}],
  'Humming + Scan':        [{p:'Inhale',s:4}, {p:'Hum out',s:6}],
  'Exhale on Effort':      [{p:'Inhale',s:3}, {p:'Exhale',s:4}],
  'Humming Breath':        [{p:'Inhale',s:4}, {p:'Hum out',s:7}],
  'Diaphragmatic 4/6':     [{p:'Inhale',s:4}, {p:'Exhale',s:6}],
  'Box Breathing':         [{p:'Inhale',s:4}, {p:'Hold',s:4}, {p:'Exhale',s:4}, {p:'Hold',s:4}],
  'Extended Box':          [{p:'Inhale',s:4}, {p:'Hold',s:4}, {p:'Exhale',s:4}, {p:'Hold',s:4}],
  '4-Breath Box':          [{p:'Inhale',s:4}, {p:'Hold',s:4}, {p:'Exhale',s:4}, {p:'Hold',s:4}],
  'Dirga':                 [{p:'Belly in',s:4}, {p:'Ribs & chest',s:3}, {p:'Exhale',s:6}],
  'Extended Exhale 4/8':   [{p:'Inhale',s:4}, {p:'Exhale',s:8}],
  'Breath-Paced Mobility': [{p:'Inhale & expand',s:4}, {p:'Exhale & return',s:5}],
  'Nasal Walking Pad':     [{p:'Inhale steps',s:4}, {p:'Exhale steps',s:4}],
  'Nasal Breathing Prep':  [{p:'Inhale',s:4}, {p:'Exhale',s:4}]
}
```

### Practice Screen Visuals

The breathing circle uses an SVG arc ring for progress (`setArcProgress(pct)`):
- Arc circumference constant: `ARC_CIRC = 295.3`
- `stroke-dashoffset` is set to `ARC_CIRC * (1 - pct)` — fills clockwise as session progresses
- Circle scale: inhale → 1.15, exhale → 0.88, hold after inhale → 1.15, hold after exhale → 0.88 (tracked via `S.lastPhaseWasInhale`)
- Phase dots rendered by `markDot()` at bottom of practice screen
- Breadcrumbs rendered by `makeCrumbs()` on drill/time/practice screens showing energy+goal+time path

### History Screen

Three tabs managed by `switchHDTab(tab)`:
- **Sessions** — `renderSessions()` renders a list of past session cards
- **This Week** — `renderWeekChart()` renders a 7-bar chart for the current week
- **This Month** — `renderMonthChart()` renders a month-view chart

Both chart functions call `buildSummary(sessions, label)` to render a period summary block.

Display constants (defined in JS, used by history/profile rendering):
```javascript
DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
ENERGY_LABEL  = {flare:'Flare', moderate:'Moderate', good:'Good day'}
ENERGY_COLOUR = {flare:'#FF8A80', moderate:'#FFD180', good:'#A5D6A7'}
```

### Profile Screen

`loadSessionStats(uid)` queries the sessions sub-collection and computes:
- **Total sessions** — shown as `'100+'` if the Firestore query cap is hit
- **Day streak** — computed by `calcStreak(sessions)`
- **This week** — count of sessions in the current week

### Additional Screens

- **Resources** (`screen-resources`) — Breathwork Library: searchable accordion cards for all 18 drills, organized by category. `filterLibrary()` / `toggleLibCard()` manage search and expand.
- **Suggest** (`screen-suggest`) — Embedded Google Form for feature suggestions. Interactions tracked via `trackSuggest()`.
- **Privacy** (`screen-privacy`) — Privacy policy text.

### Reminders

`saveReminders()` writes `{morning, evening, wake, sleep}` to both `evolve_reminders` in localStorage and as `reminders` map in Firestore. A `setInterval` runs every 30 seconds calling `checkReminders()`, which compares the current `HH:mm` against user-stored morning/evening times and calls `showBanner()` when matched.

The ambient sound selector (off/drone/bowls/rain/nature) lives in the Reminders screen UI and is managed by `selectSound(choice)` + `loadSoundPref()`.

### App Header

`app-header-row` is shown only when a user is logged in (`onUserLoggedIn` shows it, `onUserLoggedOut` hides it). It contains the hamburger menu toggled by `toggleMenu()` / `menuGo(target)`.

## Key Conventions

- **ES5 JavaScript** — no arrow functions, no `const`/`let`, no modules. Keep new code consistent with the surrounding style.
- **CSS variables** are defined in `:root` — use them for colors rather than hardcoding hex values:
  ```css
  --navy: #2f354a    --coral: #fd6f15    --bg: #e8f2fb
  --teal: #fd6f15    --sky: #a0a0c0      --teal-lt: #fdaa7a
  --teal-bg: #fef0e6 --sky-bg: #e8f2fb   --coral-bg: #fef0e6
  --navy-lt: #3d4560 --mist: #e2e2e8     --text: #2f354a
  --text-lt: #6e6e73 --radius: 16px
  --inhale: #FFB347  --exhale: #6B8CAE   --hold: #9B8EC4
  ```
- **Screen IDs** follow the pattern used in `show()` calls — check existing `show('...')` calls before adding new screens.
- All Firestore writes should gracefully degrade when offline; wrap in `.catch()` that falls back to localStorage.
- Phase labels in `PHASE_PATTERNS` can be non-standard strings (e.g. `'Sigh out'`, `'Hum out'`, `'Belly in'`). Audio selection in `getSoundForPhase()` uses substring matching — preserve this when adding new drills.
- When adding new ambient sound types, update `buildXxx()`, `startAmbient()`, the `eb_sound` values, and the Reminders screen UI.

## All Top-Level Functions (index.html)

```
show, goBack, goHome, selectEnergy, buildGoals, selectGoal, buildTimes,
selectTime, buildDrills, selectDrill, parseRounds, setupPractice, setCircle,
circleTapped, startCountdown, runPhase, markDot, togglePause, stopPractice,
completePractice, repeatDrill, getCtx, toggleMute, stopSound, playTone,
getSoundForPhase, playCountdownTick, showHistory, switchHDTab, renderWeekChart,
renderMonthChart, dotHTML, buildSummary, toggleMenu, menuGo, showResources,
switchResTab, toggleLibCard, filterLibrary, addMins, fmtTime, updateReminders,
loadRemindersFromStorage, showReminders, startReminderChecker, checkReminders,
showBanner, dismissBanner, showSuggest, trackSuggest, nextOnboard, finishOnboard,
getAmbCtx, selectSound, loadSoundPref, startAmbient, stopAmbient, buildDrone,
buildBowls, buildRain, buildNature, setArcProgress, makeCrumbs,
onUserLoggedIn, onUserLoggedOut, doSignIn, doSignUp, doGoogleSignIn,
handleGoogleRedirect, doSignOut, showAuthPanel, showAuthError, friendlyAuthError,
createUserProfile, loadUserProfile, loadSessionStats, calcStreak, saveSession,
loadHistory, loadHistoryForDisplay, migrateLocalSessions, saveReminders,
renderSessions, clearHistory
```
