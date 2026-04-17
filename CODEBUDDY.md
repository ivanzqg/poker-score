# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

A client-side poker chip scoring tool (扑克筹码记分板). Two delivery targets from one repository:

1. **`index.html`** — Standalone single-file web app (Vue 3 CDN, no build step)
2. **`miniprogram/`** — uni-app project that compiles to both H5 and WeChat Mini Program

## Development

### Standalone web (`index.html`)

Open `index.html` directly in a browser. No install or build needed.

### uni-app (`miniprogram/`)

```bash
cd miniprogram
npm install

# H5 dev server
npm run dev:h5

# WeChat Mini Program dev build (open dist/dev/mp-weixin in WeChat DevTools)
npm run dev:mp-weixin

# Production builds
npm run build:h5
npm run build:mp-weixin
```

Requires `sass` as a dev dependency (already in package.json).

## Architecture

### Standalone web (`index.html`)

Everything lives in a single file: HTML template, CSS (`<style>`), and JavaScript (`<script>`). Vue 3 loaded via CDN.

### uni-app (`miniprogram/src/`)

Vue 3 Composition API with uni-app framework. Single page (`pages/index/index.vue`) with in-page custom tab bar — not tabBar pages — because all 3 tabs share state heavily.

**Key directories:**
- `composables/` — State management: `useGameState.js` (core state + mutations), `useSettlement.js` (settlement computed), `useStorage.js` (uni storage wrapper)
- `components/` — 8 Vue SFC components: TopBar, TabBar, PlayerCard, AddPlayerPanel, SettleChecker, SettleInputRow, ResultModal, RestoreBar
- `utils/helpers.js` — Pure functions: `formatAgo()`, `calcTransfers()`

**Platform differences from standalone web:**
- `localStorage` → `uni.setStorageSync` / `uni.getStorageSync`
- `alert()` / `confirm()` → `uni.showToast()` / `uni.showModal()` (async)
- HTML elements → uni-app components (`<view>`, `<text>`, `<scroll-view>`)
- CSS custom properties → SCSS variables (in `uni.scss`)
- `<table>` → flexbox `<view>` layout

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
