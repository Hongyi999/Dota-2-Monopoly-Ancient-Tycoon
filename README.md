# Ancient Tycoon

A Dota 2 themed Monopoly-style board game built with Godot Engine 4.x

## Game Overview

Ancient Tycoon is a digital board game that combines the strategic property management of Monopoly with the rich universe of Dota 2. Players choose from 10 unique heroes, each with special abilities, and compete to dominate a 32-space board filled with Dota 2 themed properties.

## Features

- **32-Space Board**: Inspired by the Dota 2 map (Radiant Jungle, Mid Lane, Dire Offlane, High Ground)
- **10 Playable Heroes**: Each with unique passive or active abilities
- **Item Shop System**: 8 purchasable items including Divine Rapier, Black King Bar, and more
- **Card Systems**: Rune cards and Neutral Item cards for random events
- **Building System**: Upgrade properties with green houses and red hotels
- **2-5 Players**: Local multiplayer support

## Technology Stack

- **Engine**: Godot 4.3
- **Language**: GDScript
- **Platform**: Windows, Linux, macOS (future: Web export)

## Project Structure

```
ancient-tycoon/
├── project.godot          # Main project configuration
├── scenes/                # Game scenes (.tscn files)
├── scripts/               # GDScript files (.gd)
├── assets/                # Game assets
│   ├── textures/          # 2D textures and sprites
│   ├── models/            # 3D models
│   ├── sounds/            # Audio files
│   └── ui/                # UI elements
└── data/                  # Game data (JSON/resources)
```

## Getting Started

### Prerequisites
- Godot Engine 4.3 or later ([Download here](https://godotengine.org/download))

### Running the Project
1. Clone this repository
2. Open Godot Engine
3. Click "Import" and select the `project.godot` file
4. Click "Import & Edit"
5. Press F5 to run the game

## Development Roadmap

### Phase 1: Core Prototype ✅
- [x] Project setup
- [ ] Basic 32-space board
- [ ] Dice roll and movement system
- [ ] 3 test heroes (Alchemist, Axe, Techies)
- [ ] Purchase, rent, bankruptcy system

### Phase 2: Game Mechanics
- [ ] All 10 heroes
- [ ] Building system (houses + hotels)
- [ ] Item system
- [ ] Card systems
- [ ] Complete UI/UX

### Phase 3: Art & Audio
- [ ] 3D models and textures
- [ ] Particle effects
- [ ] Sound effects and BGM
- [ ] Animations

### Phase 4: Testing & Balance
- [ ] Playtesting
- [ ] Balance adjustments
- [ ] Bug fixes
- [ ] Performance optimization

## Game Design Document

See `Game_Design_Document_v2_EN.md` for the complete game design documentation.

## License

This project is for educational purposes. Dota 2 and all related assets are property of Valve Corporation.

## Credits

- Game Design: Based on Monopoly mechanics with Dota 2 theme
- Engine: Godot Engine
- Dota 2: Valve Corporation
