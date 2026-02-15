# 🏛️ Ancient Tycoon (远古大亨)

> A Dota 2 Themed Monopoly Board Game · Jungle Edition v0.4.0

**[🎮 Play Now](https://hongyi999.github.io/Dota-2-Monopoly-Ancient-Tycoon/)**

---

## 📖 About

Ancient Tycoon is a Dota 2 themed Monopoly-style web board game. Players choose from iconic Dota 2 heroes, roll dice to move along a winding jungle trail, buy properties, build houses and hotels, use items and cards, and compete to become the ultimate tycoon!

Fully playable in the browser with a Chinese UI — no download or installation required.

---

## ✨ Key Features

### 🗺️ Winding Jungle Board
- **36-space organic loop** — not a traditional square board, but a winding jungle trail
- SVG glowing path connecting all spaces with a deep green jungle color scheme
- Firefly particles + drifting fog animations for an atmospheric night jungle feel
- Each space features type-specific icons, hover tooltips, and owner indicators

### 🦸 10 Playable Heroes
| Hero | Ability | Effect |
|------|---------|--------|
| Alchemist | Greed (Passive) | Earns bonus gold when passing Start |
| Bounty Hunter | Jinada (Passive) | Gains bonus gold when collecting rent |
| Nature's Prophet | Teleport (Active) | Teleport to any space on the board |
| Techies | Mine (Active) | Place a mine on any space |
| Faceless Void | Time Walk (Active) | Return to your previous position |
| Axe | Culling Blade (Active) | Opponents pay double rent on your properties |
| Phantom Assassin | Coup de Grace (Passive) | Chance to critical strike rent (double) |
| Lich | Chain Frost (Active) | Freeze an opponent's property for one turn |
| Windranger | Windrun (Active) | Double movement on your next roll |
| Rubick | Spell Steal (Active) | Copy an opponent's ability |

### 🏗️ Building System
- **Green Houses** (up to 4): Rent multipliers ×3 / ×5 / ×8 / ×15
- **Red Hotel** (1 per property): Rent multiplier ×30, requires 4 houses + 500G
- Even-build rule: Properties in the same color set must be upgraded evenly
- Hotel restriction: Hotels cannot be built before turn 20

### 🃏 Card System
- **7 Rune Cards**: Bounty Rune, Double Damage, Illusion, Haste, and more
- **8 Neutral Item Cards**: Poor Man's Shield, Ironwood Tree, Fairy Fire, and more
- Weighted probability drawing with varying odds for each card

### 💰 Economy Balance
| Parameter | Value |
|-----------|-------|
| Starting Gold | 2,000G |
| Salary per Lap | 200G |
| Rent Cap | 40% of total assets |
| House Cost | 100G |
| Hotel Cost | 500G |
| Buyback Cost | 500G (respawn with 1,000G) |
| Max Turns | 50 |

### 🎲 Animations & Effects
- 3D dice rolling animation with realistic tumbling
- Step-by-step player movement along the path with bounce effects
- Firefly glow + drifting fog particle system
- Space hover highlights + property info tooltips

---

## 🎮 How to Play

1. **Pick a Hero** — 2–5 players each select a Dota 2 hero
2. **Roll the Dice** — Click to roll; your token moves automatically along the path
3. **Buy Properties** — Land on an unowned property to purchase it
4. **Collect Rent** — Opponents landing on your property must pay rent
5. **Build Upgrades** — Own all properties in a color set to build houses/hotels
6. **Use Abilities** — Hero abilities can turn the tide at critical moments
7. **Draw Cards** — Landing on Rune/Neutral spaces triggers card effects
8. **Win the Game** — Last player standing or highest net worth after 50 turns wins

---

## 🛠️ Tech Stack

A purely client-side static web game — no backend server required.

```
web/
├── index.html           # Main game page
├── css/
│   └── style.css        # Jungle dark theme styles
└── js/
    ├── constants.js     # Game data: heroes, properties, items, cards
    ├── board.js         # Board rendering, path layout, particle animations
    ├── game.js          # Core game logic, building system
    └── ui.js            # UI controller, screen management
```

- **Languages**: HTML / CSS / JavaScript (vanilla, no framework dependencies)
- **Image Assets**: Steam CDN (official Dota 2 hero & item images)
- **Board Rendering**: HTML + CSS + SVG (not Canvas)
- **Animations**: CSS Transitions + Canvas particle system

---

## 🚀 Run Locally

```bash
git clone https://github.com/Hongyi999/Dota-2-Monopoly-Ancient-Tycoon.git
cd Dota-2-Monopoly-Ancient-Tycoon/web
python3 -m http.server 5000
```

Then open `http://localhost:5000` in your browser.

---

## 📄 Design Document

See `Game_Development_Document_v2_Optimized[CN] .md` for the full game design documentation (in Chinese).

---

## 📜 Disclaimer

This project is for educational and entertainment purposes only. Dota 2 and all related assets are the property of Valve Corporation.

---

## 🙏 Credits

- Game Design: Classic Monopoly mechanics with a Dota 2 twist
- Hero & Item Images: Valve Corporation / Steam CDN
