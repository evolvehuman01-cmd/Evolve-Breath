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
index.html       # Entire app — HTML, CSS, and JS (~2650 lines)
sw.js            # Service Worker (cache-first strategy, ~63 lines)
manifest.json    # PWA manifest
icon-192.png     # App icon
icon-512.png     # Splash screen icon
```

### Navigation Model

The app is a set of named `<div>` screens toggled with `display` via the `show(id)` function. There is no router. Back navigation is managed by a manual `_history` stack in `goBack()`.

### Session State

All in-flight session state lives in a single global object `S`:

```javascript
S = {
  energy,       // 'flare' | 'moderate' | 'good'
  goal,         // selected goal name
  goalCat,      // internal category (e.g. DOWN_REGULATION)
  time,         // duration key: '1' | '2' | '1-2' | '5' | '10'
  timeLabel,    // display string e.g. "5 minutes"
  drill,        // drill object {name, rounds, instr, rec}
  totalRounds, currentRound,
  phases,       // array of {p: 'Inhale'|'Exhale'|'Hold', s: seconds}
  phaseIdx,
  started, paused,
  breathTimer, cdTimer  // setInterval IDs
}
```

### User Flow

```
Energy selection → Goal selection → Time selection → Drill selection
→ 10s countdown → Breathing loop (visual + audio) → Save session → Home
```

### Data Persistence

- **localStorage** (offline): `evolve_history`, `evolve_reminders`, `eb_onboarded`, `eb_sound`
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

### Audio Engine

All audio is synthesized via the Web Audio API — there are no audio files. Key tone frequencies:

| Phase   | Frequency   | Notes                      |
|---------|-------------|----------------------------|
| Inhale  | 196 Hz (G3) | Detuned chorus effect       |
| Exhale  | 165 Hz (E3) | Descending pitch contour    |
| Hold    | 196 Hz (G3) | Steady sine                 |
| Hum     | 123 Hz (B2) | LFO-modulated               |
| Tick    | 320→240 Hz  | Countdown guide clicks      |

Ambient sounds (drone, singing bowls, rain, nature) are also synthesized on demand. The `AudioContext` is created on first user tap to comply with browser autoplay policies.

### Drill / Goal Data Structures

Drills are defined in the `DRILLS` object, keyed by energy level and goal category. Phase timing patterns are in `PHASE_PATTERNS`, keyed by drill name:

```javascript
PHASE_PATTERNS['Box Breathing'] = [
  {p:'Inhale',s:4}, {p:'Hold',s:4}, {p:'Exhale',s:4}, {p:'Hold',s:4}
]
```

Goals map to internal categories (`DOWN_REGULATION`, `COGNITIVE_CALMING`, etc.) that determine which drills are offered.

### Reminders

A `setInterval` runs every 30 seconds calling `checkReminders()`, which compares the current `HH:mm` against user-stored morning/evening times. Reminder prefs are stored in both Firestore and localStorage.

## Key Conventions

- **ES5 JavaScript** — no arrow functions, no `const`/`let`, no modules. Keep new code consistent with the surrounding style.
- **CSS variables** are defined in `:root` — use them for colors rather than hardcoding hex values. Key vars: `--navy`, `--coral`, `--bg`, `--sky`, `--inhale`, `--exhale`, `--hold`.
- **Screen IDs** follow the pattern used in `show()` calls — check existing `show('...')` calls before adding new screens.
- All Firestore writes should gracefully degrade when offline; wrap in `.catch()` that falls back to localStorage.
- The Firebase config (API key etc.) in `index.html` is a public client-side config — this is intentional for Firebase web apps and not a secret.
