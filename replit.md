# 远古大亨 (Ancient Tycoon)

## Overview
A Dota 2 themed Monopoly-style board game. Full Chinese UI with Dota 2 hero/item images from Steam CDN. Standalone web version (HTML/CSS/JS) with jungle-themed winding path board.

## Current State
- Web version playable in browser (Chinese)
- **Jungle-themed winding path board** (not rectangular) with 36 spaces along organic loop
- Firefly particles, fog animation, SVG path glow effects
- 3D dice rolling animation, step-by-step player movement animation
- 10 heroes with unique abilities, 8 items, 7 rune cards, 8 neutral item cards
- Building system: green houses (×3/×5/×8/×15) and red hotels (×30)
- Economy: 2000G starting gold, 200G salary, 40% rent cap, hotel restriction before turn 20
- Purchase modal, card reveal modal, building menu UI
- Player health bars (safe/warning/danger/critical)
- Space tooltips with property info on hover
- Served as static files from `web/` directory on port 5000

## Recent Changes
- 2026-02-15: **Major visual overhaul** - jungle-themed winding path board
- 2026-02-15: Replaced canvas with HTML/CSS/SVG board renderer
- 2026-02-15: Added particle system (fireflies + fog) with canvas animation
- 2026-02-15: Added 3D dice rolling animation
- 2026-02-15: Added step-by-step player movement animation along path
- 2026-02-15: Each space has type-specific icons, hover effects, owner rings
- 2026-02-15: Dark green jungle color scheme throughout

## Project Architecture
- `web/` - Static web game (HTML/CSS/JS)
  - `web/index.html` - Main game page
  - `web/css/style.css` - Jungle dark theme styles
  - `web/js/constants.js` - Game data: heroes, 36 properties, items, cards with CDN URLs
  - `web/js/board.js` - Board path layout, space rendering, particles, animations
  - `web/js/game.js` - Game logic, building system
  - `web/js/ui.js` - UI controller, screen management, game reset

## Key Constants
- TOTAL_SPACES: 36 (corners at 0, 9, 18, 27)
- JAIL_POSITION: 9
- STARTING_GOLD: 2000
- BASE_SALARY: 200
- RENT_MULTIPLIERS: [1, 3, 5, 8, 15, 30]
- RENT_CAP: 40% of total assets
- HOTEL_MIN_TURN: 20
- Building costs: house 100G, hotel 500G

## Running
Static file server: `python3 -m http.server 5000 --bind 0.0.0.0` from `web/`

## Deployment
Static site serving `web/` directory.

## User Preferences
- Language: Chinese (中文)
- Jungle/forest visual theme preferred
- Wants animations and dynamic visual effects
- Following design doc: attached_assets/Game_Development_Document_v2_Optimized[CN]__1771153289329.md
