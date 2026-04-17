# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

A client-side poker chip scoring tool (扑克筹码记分板). No backend, no build step — the entire app is a single `index.html` file served as static HTML.

## Development

Open `index.html` directly in a browser. No install, build, lint, or test commands exist. There is no `package.json`, no bundler, and no dev server. To preview changes, refresh the browser.

Deployment targets: Vercel, Netlify, GitHub Pages, or any static file host.

## Architecture

### Single-file structure

Everything lives in `index.html`: HTML template, CSS (`<style>`), and JavaScript (`<script>`). There are no other source files.

### Framework

Vue 3 loaded via CDN (`unpkg.com/vue@3/dist/vue.global.prod.js`), using the Composition API (`setup()` with `ref`, `computed`, `watch`, `onMounted`). A single `createApp` call mounts the entire app to `#app`.

### UI layout

The app uses a tab-based layout with three tabs:
- **Game** (`tab === 'game'`): Add/remove players, buy-in tracking, game state display
- **Settle** (`tab === 'settle'`): Enter final chip counts with real-time validation (total chips must balance)
- **Config** (`tab === 'config'`): Set chips-per-hand value

A modal overlay (`showResult`) displays settlement results and optimal transfer suggestions.

### Data model

All state is held in Vue refs within `setup()`. The core data structure is the `players` array, where each player object contains:
- `id`, `name` — identity
- `totalBuyIn`, `buyCount`, `buyHands` — cumulative buy-in tracking
- `buyInputHands` — transient input for additional buy-ins
- `settleInput`, `remaining`, `pnl` — settlement fields

### Key algorithms

**Settlement validation**: `filledTotal` (sum of all `settleInput` values) must exactly equal `totalChips` (sum of all `totalBuyIn` values) before settlement is allowed. A progress bar and diff display provide real-time feedback.

**Optimal transfers** (`transfers` computed): A greedy two-pointer algorithm matches losers to winners to minimize the number of transfers needed to settle all debts.

### Persistence

Game state is serialized to `localStorage` under key `poker_game_v2`. Auto-save triggers on player add/remove, buy-in, and settlement. On page load, `onMounted` checks for saved state and offers a restore prompt.

### Styling

All CSS is in a single `<style>` block using CSS custom properties (`:root` variables) for theming. The design is mobile-first with a poker-table green color scheme. The layout uses flexbox with `100dvh`/`100vh` full-height and a fixed top bar + tab bar with scrollable content area.

### Language

All UI text is in Chinese (zh-CN). Keep UI strings in Chinese when making changes.
