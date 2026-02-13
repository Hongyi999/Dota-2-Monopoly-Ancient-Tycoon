# Ancient Tycoon - Game Design Document v2.0

**Project Name:** Ancient Tycoon
**Genre:** Board Game / Strategy / Party Game
**Platform:** Web (Desktop + Mobile), Future: PC/Mac Native
**Target Audience:** Dota 2 players, board game enthusiasts
**Development Status:** Phase 2 - Full Feature Implementation
**Last Updated:** 2026-02-13

---

## 📑 Table of Contents

1. [Game Overview](#game-overview)
2. [Core Gameplay](#core-gameplay)
3. [Game Board & Map](#game-board--map)
4. [Heroes System](#heroes-system)
5. [Properties & Economy](#properties--economy)
6. [Items & Shop](#items--shop)
7. [Card Systems](#card-systems)
8. [Victory Conditions](#victory-conditions)
9. [Visual Design & UI/UX](#visual-design--uiux)
10. [Audio Design](#audio-design)
11. [Technical Specifications](#technical-specifications)
12. [Development Roadmap](#development-roadmap)

---

## 🎮 Game Overview

### Concept
Ancient Tycoon is a Dota 2-themed Monopoly-style board game that combines strategic property management with hero abilities inspired by the iconic MOBA game. Players compete on a 32-space board representing the Dota 2 map, using unique hero powers to dominate the economy and bankrupt opponents.

### Core Experience
- **Strategic Depth:** Choose heroes with unique abilities that complement different playstyles
- **Economic Management:** Balance property investments, building upgrades, and item purchases
- **Tactical Decisions:** Use hero abilities, items, and cards at the right moment
- **Social Interaction:** 2-5 players compete in an engaging, fast-paced board game

### Key Differentiators
- **Hero Abilities:** Unlike traditional Monopoly, each player has unique active/passive powers
- **Dota 2 Theming:** Familiar locations, items, and mechanics for Dota 2 fans
- **3D Visual Presentation:** Modern 3D graphics with particle effects and animations
- **Multi-language Support:** Full Chinese and English localization

---

## 🎲 Core Gameplay

### Game Flow

#### 1. **Setup Phase**
1. Select number of players (2-5)
2. Each player selects a unique hero
3. All players start at the Fountain with 1500 Gold
4. Turn order determined randomly

#### 2. **Turn Structure**
Each turn consists of:

1. **Roll Phase:**
   - Player rolls 2 dice (1-6 each)
   - Move forward by total value
   - Rolling doubles grants an extra turn (max 3 consecutive)
   - Rolling doubles 3 times in a row → sent to Low Priority

2. **Landing Phase:**
   - Trigger space effect based on type:
     - **Property:** Purchase or pay rent
     - **Corner Space:** Special effect (Fountain, Jail, etc.)
     - **Card Space:** Draw Rune or Neutral Item card
     - **Shop:** Pay tax and optionally purchase items
     - **Transportation:** Pay rent based on Outposts owned

3. **Action Phase:**
   - Use hero ability (if available and not on cooldown)
   - Use items (if owned)
   - Build houses/hotels (if color set complete)
   - Trade with other players (optional)

4. **End Turn:**
   - Pass dice to next player
   - Update cooldowns
   - Check victory/defeat conditions

#### 3. **Salary Mechanism**
- Passing or landing on Fountain: +200 Gold
- Modified by hero bonuses (Alchemist: +30G)
- Modified by items (Wraith Band: +50G)

---

## 🗺️ Game Board & Map

### Board Layout (32 Spaces)

The board is designed to represent the Dota 2 map, with distinct regions:

#### **Quadrant 1: Radiant Territory (0-8)**
- **0 - Fountain (Corner):** Starting point, +200G salary
- **1 - Small Camp (Property):** Brown set, 60G
- **2 - Medium Camp (Property):** Brown set, 60G
- **3 - Outpost 1 (Transportation):** 200G
- **4 - Radiant T1 Tower (Property):** Light Blue set, 100G
- **5 - Bounty Rune (Chance):** Draw Rune card
- **6 - Radiant T2 Tower (Property):** Light Blue set, 100G
- **7 - Radiant Shrine (Property):** Light Blue set, 120G
- **8 - Side Shop (Tax):** Pay 100G, can buy items

#### **Quadrant 2: Mid Lane (9-17)**
- **9 - Low Priority (Corner):** Jail equivalent
- **10 - Mid T1 Tower (Property):** Pink set, 140G
- **11 - Secret Shop (Utility):** 150G, rent = dice × 4 (or ×10 if both utilities owned)
- **12 - Mid T2 Tower (Property):** Pink set, 140G
- **13 - Mid T3 Tower (Property):** Pink set, 160G
- **14 - Outpost 2 (Transportation):** 200G
- **15 - Radiant Ancients (Property):** Orange set, 180G
- **16 - Neutral Item (Community Chest):** Draw Neutral Item card
- **17 - Dire Ancients (Property):** Orange set, 200G

#### **Quadrant 3: Dire Territory (18-26)**
- **18 - Roshan Pit (Corner):** Free Parking, roll doubles to fight Roshan
- **19 - Dire T1 Tower (Property):** Red set, 220G
- **20 - Haste Rune (Chance):** Draw Rune card
- **21 - Dire T2 Tower (Property):** Red set, 220G
- **22 - Dire T3 Tower (Property):** Red set, 240G
- **23 - Outpost 3 (Transportation):** 200G
- **24 - Dire Melee Barracks (Property):** Yellow set, 260G
- **25 - Dire Ranged Barracks (Property):** Yellow set, 260G
- **26 - Jungle Shop (Utility):** 150G, rent = dice × 4 (or ×10)

#### **Quadrant 4: High Ground (27-35)**
- **27 - Reported! (Corner):** Go to Low Priority
- **28 - Radiant Melee Barracks (Property):** Green set, 300G
- **29 - Radiant Ranged Barracks (Property):** Green set, 300G
- **30 - Neutral Item (Community Chest):** Draw Neutral Item card
- **31 - Radiant T4 Towers (Property):** Independent, 320G
- **32 - Outpost 4 (Transportation):** 200G
- **33 - Buyback Cost (Tax):** Pay 200G or 10% assets (higher)
- **34 - Radiant Ancient (Property):** Deep Blue set, 350G
- **35 - Dire Ancient (Property):** Deep Blue set, 400G

### Color Sets
Properties are grouped into color sets for building monopolies:

- **Brown:** Small Camp, Medium Camp (2 properties)
- **Light Blue:** Radiant T1/T2/Shrine (3 properties)
- **Pink:** Mid T1/T2/T3 Towers (3 properties)
- **Orange:** Radiant/Dire Ancients (2 properties)
- **Red:** Dire T1/T2/T3 Towers (3 properties)
- **Yellow:** Dire Melee/Ranged Barracks (2 properties)
- **Green:** Radiant Melee/Ranged Barracks (2 properties)
- **Deep Blue:** Radiant/Dire Ancient (2 properties)
- **Independent:** Radiant T4 Towers (1 property, can build without set)

### 3D Map Design (Monopoly GO Style)

#### Visual Style
- **Isometric 3D view** with dynamic camera angles
- **Dota 2 aesthetic:** River running through the center, jungle areas with trees
- **Animated environment:** Flowing river, swaying trees, glowing towers
- **Day/Night cycle** (optional): Changes lighting and ambiance

#### Map Zones
- **Radiant Base (Bottom-Left):** Green, lush, bright lighting
- **Dire Base (Top-Right):** Dark, ominous, red/purple tones
- **River (Center):** Animated water with reflections
- **Jungle Areas:** Dense foliage with neutral camp markers
- **Lanes:** Three distinct paths (Safe, Mid, Off) visible on the board

#### Interactive Elements
- **Minimap display** showing player positions
- **Animated tokens:** Hero models move along the board
- **Building upgrades:** Houses appear as outposts, hotels as barracks
- **Particle effects:** Gold sparkles on salary, smoke on ability use

---

## 🦸 Heroes System

### Hero Roster (10 Heroes)

#### 1. **Alchemist** (Beginner, Economic)
- **Type:** Passive
- **Ability:** Greedy
- **Effect:** Salary +30G, Rent income +5%
- **Power Rating:** 4/5
- **Strategy:** Snowball economy early, dominate mid-late game

#### 2. **Bounty Hunter** (Advanced, Economic Defense)
- **Type:** Passive
- **Ability:** Jinada
- **Effect:** Pay 20% less rent on others' properties (max 3 times/lap)
- **Power Rating:** 4/5
- **Strategy:** Aggressive land grabbing with reduced risk

#### 3. **Nature's Prophet** (Intermediate, Mobility)
- **Type:** Active (CD: 7 turns)
- **Ability:** Teleportation
- **Effect:** Teleport to any unpurchased property or own property (costs 50G)
- **Power Rating:** 4/5
- **Strategy:** Strategic positioning, snipe high-value properties

#### 4. **Techies** (Beginner, Control)
- **Type:** Active (CD: 4 turns)
- **Ability:** Land Mines
- **Effect:** Place mine on any space; next player to land takes 100G damage and is stunned 1 turn
- **Power Rating:** 3/5
- **Strategy:** Trap expensive properties, disrupt opponents

#### 5. **Faceless Void** (Intermediate, Tactical)
- **Type:** Active (CD: 5 turns)
- **Ability:** Time Walk
- **Effect:** After rolling, undo and move back 1-3 spaces
- **Power Rating:** 4/5
- **Strategy:** Avoid bad spaces, optimize landing positions

#### 6. **Crystal Maiden** (Beginner, Card Advantage)
- **Type:** Passive
- **Ability:** Arcane Aura
- **Effect:** When drawing Rune cards, draw 2 and choose 1
- **Power Rating:** 3/5
- **Strategy:** Consistent value, good for new players

#### 7. **Rubick** (Advanced, Versatility)
- **Type:** Active (CD: 4 turns)
- **Ability:** Spell Steal
- **Effect:** Copy the last active ability used by the previous player
- **Power Rating:** 4/5
- **Strategy:** High skill ceiling, adapts to opponents

#### 8. **Axe** (Beginner, Aggressive)
- **Type:** Passive
- **Ability:** Counter Helix
- **Effect:** When someone lands on the same space, they pay you 50G
- **Power Rating:** 3/5
- **Strategy:** Sit on high-traffic areas, punish movement

#### 9. **Invoker** (Advanced, Offensive)
- **Type:** Active (CD: 6 turns)
- **Ability:** Sun Strike
- **Effect:** Target a player, deduct 10% of their current gold (min 100G, max 500G)
- **Power Rating:** 4/5
- **Strategy:** Deny opponents during key moments

#### 10. **Pudge** (Intermediate, Control)
- **Type:** Active (CD: 4 turns)
- **Ability:** Meat Hook
- **Effect:** Hook a player 3-4 spaces ahead to your current space
- **Power Rating:** 3/5
- **Strategy:** Force opponents onto your properties

### Hero Selection UI
- **3D hero portraits** with rotating models
- **Ability preview** with animations
- **Difficulty indicators:** Beginner/Intermediate/Advanced
- **Power rating visualization:** 1-5 stars
- **Lore snippets** from Dota 2

---

## 🏠 Properties & Economy

### Property Ownership

#### Purchase Mechanics
- **Landing on unowned property:** Option to purchase at listed price
- **Auction system (optional):** If declined, property goes to auction
- **Trading:** Players can trade properties, gold, and "Get out of jail" cards

#### Rent Calculation
```
Base Rent = Property's base_rent value

Rent Multipliers:
- 0 houses: 1× base rent
- 1 house: 3× base rent
- 2 houses: 5× base rent
- 3 houses: 8× base rent
- 4 houses: 15× base rent
- Hotel: 30× base rent

Final Rent = Base Rent × Multiplier × Hero Bonuses × Item Bonuses
```

#### Building System
- **House cost:** 100G (green house visual)
- **Hotel cost:** 500G (converts 4 houses → 1 red hotel)
- **Requirements:**
  - Must own all properties in a color set
  - Must build evenly (max 1 level difference within set)
- **Maximum:** 4 houses OR 1 hotel per property

### Economic Balance

#### Starting Resources
- **Initial Gold:** 1500G per player
- **No starting properties**

#### Income Sources
1. **Salary:** 200G per lap (passing/landing on Fountain)
2. **Rent Collection:** From opponents landing on your properties
3. **Card Effects:** Bounty Rune (+150G), Tome of Knowledge (+300G)
4. **Hero Abilities:** Alchemist bonus, Axe friction fees

#### Expenses
1. **Property Purchases:** 60G - 400G
2. **Building Upgrades:** 100G per house, 500G per hotel
3. **Rent Payments:** To property owners
4. **Taxes:** Side Shop (100G), Buyback Cost (200G or 10%)
5. **Item Purchases:** 50G - 3000G
6. **Ability Costs:** Nature's Prophet teleport (50G)

#### Bankruptcy
- **Trigger:** Gold drops to 0 and cannot pay debts
- **Consequences:**
  - All properties return to unowned state
  - All items dropped (Divine Rapier goes to debt holder)
  - Player eliminated from game

---

## 🛒 Items & Shop

### Item Categories

#### 1. **Economic Items**
| Item | Price | Effect | Notes |
|------|-------|--------|-------|
| Wraith Band | 200G | Salary +50G | Pays back in 4 laps |
| Town Portal Scroll | 50G | Teleport to Fountain next turn | One-time use |

#### 2. **Tactical Items**
| Item | Price | Effect | Notes |
|------|-------|--------|-------|
| Phase Boots | 500G | Choose one die value instead of sum | CD: 5 turns |
| Aghanim's Shard | 800G | All ability CDs -1 turn | Permanent |
| Aghanim's Scepter | 1500G | Force upgrade any property 1 level (ignore color set) | One-time use |
| Bottle | 100G | Store 1 Rune card for later | Permanent |

#### 3. **Offensive Items**
| Item | Price | Effect | Notes |
|------|-------|--------|-------|
| Divine Rapier | 3000G | All property rent ×1.5 | Drops on bankruptcy |

#### 4. **Defensive Items**
| Item | Price | Effect | Notes |
|------|-------|--------|-------|
| Black King Bar | 300G | Immune to 1 jail or mine | One-time use |

### Item Shop Locations
- **Side Shop (Space 8):** Pay 100G tax, then can purchase items
- **Jungle Shop (Space 26):** Same as Side Shop
- **Anytime Purchase (Optional Rule):** Allow item purchases during own turn

### Item UI Design
- **3D item models** with rotating showcase
- **Hover effects** showing detailed stats
- **Purchase confirmation** with animation
- **Inventory system** showing owned items with cooldown indicators

---

## 🎴 Card Systems

### Rune Cards (Chance Spaces)

Drawn when landing on **Bounty Rune (5)** or **Haste Rune (20)**:

| Card | Rarity | Probability | Effect |
|------|--------|-------------|--------|
| Bounty | Common | 20% | Immediately gain 150G |
| Regeneration | Common | 20% | Immune to next rent payment |
| Illusion | Common | 20% | Place illusion trap; next player stunned 1 turn |
| Double Damage | Rare | 15% | Next rent collection ×2 |
| Haste | Rare | 15% | Next dice roll +3 |
| Invisibility | Epic | 5% | Pass opponent properties without rent until next roll |
| Arcane | Epic | 5% | All ability CDs refresh immediately |

**Crystal Maiden Bonus:** Draw 2, choose 1 to keep

### Neutral Item Cards (Community Chest)

Drawn when landing on **Neutral Item (16, 30)**:

| Card | Type | Probability | Effect |
|------|------|-------------|--------|
| Tome of Knowledge | Positive | 13% | Immediately gain 300G |
| GabeN's Blessing | Positive | 13% | Next building upgrade 50% off |
| Refresher Orb | Positive | 14% | All ability CDs refresh |
| Deny | Neutral | 15% | One property immune to negative effects, but no rent this turn |
| Roshan is Up | Neutral | 15% | All players move 1-2 spaces toward Roshan Pit |
| Connection Lost | Negative | 15% | Skip 1 turn, cannot collect rent |
| Ganked! | Negative | 10% | Pay 30G to each player |
| Nerfed by Patch | Negative | 5% | All properties -30% rent this turn |

### Card UI
- **3D card flip animation** when drawn
- **Visual effects** matching card type (gold sparkles for positive, dark smoke for negative)
- **Choice UI** for Crystal Maiden's ability
- **Card history log** showing recent draws

---

## 🏆 Victory Conditions

### Win Conditions (One of the following)

1. **Last Player Standing:**
   - All other players bankrupted
   - Most common victory

2. **Economic Victory (Optional Rule):**
   - First player to reach 10,000 Gold wins
   - Includes cash + property values + building values

3. **Domination Victory (Optional Rule):**
   - Own all properties in 3 complete color sets
   - Instant win

4. **Time Limit Victory (Optional Rule):**
   - After 60 minutes (or 30 laps), player with highest net worth wins
   - Net worth = Cash + (Property prices × 0.8) + (Buildings × 0.5)

### Defeat Conditions

- **Bankruptcy:** Gold reaches 0 and cannot pay debts
- **Disconnection (Multiplayer):** Automatic forfeit after 2 minutes

---

## 🎨 Visual Design & UI/UX

### Art Style

#### Overall Aesthetic
- **Monopoly GO Inspiration:** 3D, colorful, high-energy visuals
- **Dota 2 Theme:** Recognizable landmarks, hero models, item icons
- **Clarity First:** Game state always clear despite visual complexity

#### Color Palette
- **Radiant:** Greens (#4CAF50), golds (#FFD700), bright blues (#2196F3)
- **Dire:** Reds (#F44336), purples (#9C27B0), dark grays (#424242)
- **Neutral:** River blues, jungle greens, UI grays

### 3D Implementation (Three.js)

#### Scene Setup
```javascript
// Camera: Isometric view
camera = new THREE.OrthographicCamera(...)
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)

// Lighting
- Ambient light for base visibility
- Directional light for shadows
- Point lights at Fountain and Roshan Pit

// Materials
- PBR materials for realistic reflections
- Emissive materials for glowing effects (towers, runes)
```

#### Animation System
- **Hero Movement:** Smooth lerp along board path
- **Dice Roll:** 3D dice physics simulation
- **Building Construction:** Scale-up animation with particles
- **Card Draw:** Flip animation with glow effect
- **Gold Transfer:** Particle stream from payer to receiver

#### UI Layers
1. **3D Scene Layer:** Game board, heroes, buildings
2. **2D UI Overlay:** Player info, buttons, event log
3. **Modal Layer:** Card previews, property details, trading UI

### Screen Layouts

#### Main Menu
- **Background:** Animated Dota 2 map panorama
- **Logo:** "Ancient Tycoon" with glowing effect
- **Buttons:** Start Game, Settings, How to Play, Credits
- **Language Toggle:** 🇨🇳 / 🇬🇧 flag icons

#### Hero Selection
- **Grid Layout:** 2 rows × 5 columns of hero cards
- **Hero Card:**
  - 3D rotating portrait
  - Hero name (localized)
  - Difficulty indicator
  - Ability preview on hover
- **Player Count Selector:** 2-5 players
- **Selected Heroes Panel:** Shows chosen heroes for each player

#### Game Screen
- **Top Bar:**
  - Current Turn / Player
  - Round counter
  - Menu button
- **Main Area:**
  - 3D Game Board (75% width)
  - Camera controls (zoom, rotate)
- **Side Panel (25% width):**
  - Player Info Cards (gold, properties, items)
  - Action Buttons (Roll Dice, Use Ability, End Turn)
  - Dice Result Display
  - Event Log (scrollable)
- **Bottom Overlay:**
  - Language Toggle
  - Sound Toggle
  - Fullscreen Toggle

#### Property Card (Modal)
- **3D Property Preview:** Rotating mini-scene
- **Property Info:**
  - Name (localized)
  - Price
  - Current owner
  - Rent table (0-4 houses, hotel)
  - Building cost
- **Actions:**
  - Purchase Button (if unowned)
  - Build Button (if owned + color set complete)
  - Sell Button (if owned)

### Responsive Design
- **Desktop (1920×1080+):** Full 3D scene with all effects
- **Laptop (1366×768):** Reduced particle density
- **Tablet (iPad):** Simplified shadows, lower resolution textures
- **Mobile (Phone):** 2D fallback mode (optional)

---

## 🔊 Audio Design

### Sound Categories

#### 1. **Music (BGM)**
- **Main Menu:** Epic orchestral Dota 2 theme
- **Radiant Territory:** Uplifting, heroic music
- **Dire Territory:** Ominous, dark music
- **Roshan Fight:** Intense battle music
- **Victory:** Triumphant fanfare
- **Defeat:** Melancholic theme

#### 2. **Sound Effects (SFX)**

##### **Game Actions**
- Dice roll (clattering sound)
- Hero movement (footsteps)
- Gold collection (coin jingle)
- Property purchase (gavel bang)
- Building construction (hammer sounds)
- Card draw (paper shuffle)

##### **Hero Abilities**
- Alchemist: Potion bubbling
- Techies: Bomb explosion
- Nature's Prophet: Teleport whoosh
- Faceless Void: Time rewind sound
- Rubick: Spell steal echo
- Pudge: Hook clank + flesh impact
- Invoker: Meteor impact
- Axe: Blade spin
- Bounty Hunter: Jinada crit
- Crystal Maiden: Ice crystallization

##### **UI Sounds**
- Button click
- Button hover
- Modal open/close
- Notification ping
- Error buzz

#### 3. **Voice Lines (Optional)**
- Hero selection quotes (e.g., "Come on, let's fight!")
- Ability activation quotes
- Victory/Defeat taunts

### Audio Implementation
- **Library:** Howler.js for cross-browser compatibility
- **Volume Controls:** Separate sliders for BGM and SFX
- **Mute Toggle:** Quick mute button
- **Spatial Audio:** 3D positional audio for hero movement

---

## 🛠️ Technical Specifications

### Technology Stack

#### Frontend
- **3D Engine:** Three.js (r150+)
- **Animation:** GSAP (GreenSock) for tweens
- **UI Framework:** Vanilla JavaScript + Custom Components
- **Internationalization:** i18next for multi-language
- **Audio:** Howler.js
- **Build Tool:** Vite (fast dev server, optimized builds)

#### Backend (Future Multiplayer)
- **Server:** Node.js + Express
- **Real-time:** Socket.io
- **Database:** MongoDB (game state persistence)
- **Hosting:** Vercel / Netlify (frontend), Heroku (backend)

### File Structure
```
ancient-tycoon/
├── docs/                       # GitHub Pages deployment
│   ├── index.html
│   ├── assets/
│   │   ├── models/            # 3D models (.glb, .gltf)
│   │   ├── textures/          # PBR textures
│   │   ├── sounds/            # Audio files (.mp3, .ogg)
│   │   ├── images/            # UI sprites, hero portraits
│   │   └── fonts/             # Custom fonts
│   ├── css/
│   │   ├── main.css
│   │   └── themes/            # Light/Dark themes
│   ├── js/
│   │   ├── main.js
│   │   ├── game/
│   │   │   ├── GameManager.js
│   │   │   ├── Player.js
│   │   │   ├── Property.js
│   │   │   ├── Hero.js
│   │   │   ├── Item.js
│   │   │   └── Card.js
│   │   ├── rendering/
│   │   │   ├── SceneManager.js
│   │   │   ├── BoardRenderer.js
│   │   │   ├── HeroRenderer.js
│   │   │   └── EffectsManager.js
│   │   ├── ui/
│   │   │   ├── UIManager.js
│   │   │   ├── MenuScreen.js
│   │   │   ├── GameScreen.js
│   │   │   └── Modals.js
│   │   ├── audio/
│   │   │   └── AudioManager.js
│   │   ├── i18n/
│   │   │   ├── i18n.js
│   │   │   ├── en.json
│   │   │   └── zh-CN.json
│   │   └── utils/
│   │       ├── Constants.js
│   │       └── Helpers.js
│   └── data/                   # Game data (JSON)
│       ├── heroes.json
│       ├── properties.json
│       ├── items.json
│       └── cards.json
├── project.godot              # Godot project (future native version)
├── scripts/                   # GDScript files
├── scenes/                    # Godot scenes
└── README.md
```

### Performance Targets
- **Load Time:** < 5 seconds on broadband
- **Frame Rate:** 60 FPS on desktop, 30 FPS on mobile
- **Memory Usage:** < 512MB RAM
- **Bundle Size:** < 20MB (before compression)

### Browser Support
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** iOS Safari 14+, Chrome Android 90+

---

## 📅 Development Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Project setup
- [x] Basic 2D web version
- [x] Core game loop
- [x] 10 heroes with data
- [x] Property system
- [x] Basic UI

### Phase 2: 3D Upgrade 🚧 (Current)

#### Sprint 1: Infrastructure (Week 1)
- [ ] Set up Three.js scene
- [ ] Implement camera controls
- [ ] Create basic 3D board layout
- [ ] Lighting and materials setup

#### Sprint 2: Core Visuals (Week 2)
- [ ] 3D property models
- [ ] Hero token models (or high-quality sprites)
- [ ] Building upgrade visuals (houses/hotels)
- [ ] Animated dice system

#### Sprint 3: UI/UX Polish (Week 3)
- [ ] Redesign UI with 3D aesthetic
- [ ] Property card modals with previews
- [ ] Hero selection screen (3D portraits)
- [ ] Smooth transitions and animations

#### Sprint 4: Multi-language (Week 4)
- [ ] i18next integration
- [ ] English translations (en.json)
- [ ] Chinese translations (zh-CN.json)
- [ ] Language toggle UI
- [ ] Dynamic text rendering

### Phase 3: Complete Game Features (Weeks 5-8)

#### Sprint 5: Items & Shop (Week 5)
- [ ] Item purchase UI
- [ ] Item effects implementation
- [ ] Shop tax system
- [ ] Inventory management
- [ ] Divine Rapier drop mechanic

#### Sprint 6: Cards System (Week 6)
- [ ] Rune card deck
- [ ] Neutral Item card deck
- [ ] Card draw animations
- [ ] Crystal Maiden's dual-draw choice
- [ ] Bottle item (store rune)

#### Sprint 7: Hero Abilities (Week 7)
- [ ] Implement all 10 hero abilities
- [ ] Cooldown tracking UI
- [ ] Ability animations and effects
- [ ] Rubick's Spell Steal logic

#### Sprint 8: Advanced Mechanics (Week 8)
- [ ] Trading system
- [ ] Auction system (optional)
- [ ] Roshan fight mechanic
- [ ] Victory condition checks
- [ ] Bankruptcy handling

### Phase 4: Audio & Polish (Weeks 9-10)

#### Sprint 9: Sound Design (Week 9)
- [ ] Source/create BGM tracks
- [ ] Record/source SFX
- [ ] Implement Howler.js audio system
- [ ] Volume controls and mute toggle
- [ ] Audio settings persistence

#### Sprint 10: Visual Effects (Week 10)
- [ ] Particle systems (gold, abilities, explosions)
- [ ] Environmental effects (river flow, day/night)
- [ ] Camera shake on major events
- [ ] Lighting effects (tower glows, card draw)

### Phase 5: Testing & Optimization (Weeks 11-12)

#### Sprint 11: Playtesting (Week 11)
- [ ] Internal testing (all features)
- [ ] Balance adjustments (gold values, rent, abilities)
- [ ] Bug fixing
- [ ] User feedback integration

#### Sprint 12: Optimization (Week 12)
- [ ] Performance profiling
- [ ] Asset compression
- [ ] Code minification
- [ ] Mobile optimization
- [ ] Cross-browser testing

### Phase 6: Launch (Week 13+)
- [ ] GitHub Pages deployment
- [ ] Documentation (How to Play)
- [ ] Trailer video
- [ ] Social media announcement
- [ ] Community feedback gathering

### Future Phases
- **Phase 7:** Multiplayer (online with friends)
- **Phase 8:** Ranked mode and leaderboards
- **Phase 9:** Custom hero workshop
- **Phase 10:** Native Godot version (desktop)

---

## 📊 Balancing Notes

### Economy Balance
- Starting gold (1500G) allows 2-3 property purchases before salary needed
- High-end properties (300-400G) require ~2 laps of salary saving
- Divine Rapier (3000G) = high-risk investment for dominant players

### Hero Balance
- **Alchemist** strong early, weaker vs control heroes
- **Techies/Pudge** disrupt property strategies
- **Rubick** skill-dependent, can counter any hero
- **Faceless Void** most versatile, balanced power

### Property Balance
- Brown set (cheapest) has lowest ROI but safe early investment
- Deep Blue set (most expensive) has highest ROI but risky
- Transportation (Outposts) valuable for denying opponent bonuses
- Utilities (Shops) strong with dice luck, weak with bad rolls

---

## 📝 Design Principles

1. **Clarity:** Game state always visible and understandable
2. **Feedback:** Every action has clear visual/audio feedback
3. **Accessibility:** Colorblind mode, screen reader support
4. **Depth:** Simple to learn, hard to master
5. **Theme:** Everything reinforces Dota 2 universe
6. **Performance:** Smooth experience even on mid-range devices

---

## 🎓 Credits & References

- **Original Concept:** Monopoly (Hasbro)
- **Theme:** Dota 2 (Valve Corporation)
- **Engine:** Three.js, Godot Engine
- **Inspiration:** Monopoly GO (Scopely)
- **Design:** [Your Name/Team]

---

## 📧 Contact & Feedback

For bug reports, feature requests, or feedback:
- **GitHub Issues:** [Repository URL]
- **Email:** [Your Email]
- **Discord:** [Community Server]

---

**Document Version:** 2.0
**Last Updated:** 2026-02-13
**Status:** Living Document (Updated Regularly)
