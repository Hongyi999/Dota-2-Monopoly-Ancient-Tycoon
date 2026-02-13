extends Node

## Game Constants
## Central location for all game balance values and constants

# Starting values
const STARTING_GOLD: int = 2000
const STARTING_POSITION: int = 0

# Board settings
const TOTAL_SPACES: int = 36  # 32 regular + 4 corners
const FOUNTAIN_POSITION: int = 0
const JAIL_POSITION: int = 9
const ROSHAN_PIT_POSITION: int = 18
const GO_TO_JAIL_POSITION: int = 27

# Salary and fees
const BASE_SALARY: int = 200
const JAIL_BAIL: int = 50
const SHOPPING_TAX: int = 100
const LUXURY_TAX: int = 200
const LUXURY_TAX_PERCENT: float = 0.10

# Building costs
const HOUSE_COST: int = 100
const HOTEL_COST: int = 500

# Rent multipliers (based on building level)
const RENT_MULTIPLIER_EMPTY: int = 1
const RENT_MULTIPLIER_1_HOUSE: int = 3
const RENT_MULTIPLIER_2_HOUSES: int = 5
const RENT_MULTIPLIER_3_HOUSES: int = 8
const RENT_MULTIPLIER_4_HOUSES: int = 15
const RENT_MULTIPLIER_HOTEL: int = 30

# Building restrictions
const MAX_HOUSES_PER_PROPERTY: int = 4
const HOTEL_TURN_RESTRICTION: int = 20  # Can't build hotels before turn 20
const RENT_CAP_PERCENT: float = 0.40  # Rent can't exceed 40% of player's assets

# Bankruptcy
const BUYBACK_COST: int = 500
const BUYBACK_STARTING_GOLD: int = 1000
const BUILDING_SELL_PERCENT: float = 0.50  # Get 50% back when selling
const PROPERTY_AUCTION_PERCENT: float = 0.80  # Auction starts at 80% of price

# Dice
const MIN_DICE_VALUE: int = 1
const MAX_DICE_VALUE: int = 6
const MAX_CONSECUTIVE_DOUBLES: int = 3  # 3 doubles = go to jail

# Player limits
const MIN_PLAYERS: int = 2
const MAX_PLAYERS: int = 5
const MAX_ITEMS_PER_PLAYER: int = 2

# Turn limits (for time victory)
const MAX_TURNS_OPTIONAL: int = 50

# Roshan challenge
const ROSHAN_VICTORY_REWARD: String = "aegis"
const ROSHAN_DEFEAT_PENALTY: int = 100

# Color sets for properties
enum ColorSet {
	BROWN,          # Small/Medium Camp
	LIGHT_BLUE,     # Radiant Towers
	PINK,           # Mid Towers
	ORANGE,         # Ancients (camps)
	RED,            # Dire Towers
	YELLOW,         # Dire Barracks
	GREEN,          # Radiant Barracks
	DEEP_BLUE,      # Ancient Cores
	INDEPENDENT     # T4 Towers
}

# Property types
enum PropertyType {
	CORNER,
	PROPERTY,
	TRANSPORTATION,
	UTILITY,
	CHANCE,
	COMMUNITY_CHEST,
	TAX
}

# Player colors
const PLAYER_COLORS: Array[Color] = [
	Color(1.0, 0.84, 0.0),    # Gold
	Color(0.75, 0.75, 0.75),  # Silver
	Color(0.80, 0.50, 0.20),  # Bronze
	Color(0.0, 0.80, 0.40),   # Emerald
	Color(0.58, 0.44, 0.86)   # Amethyst
]

# Game states
enum GameState {
	MAIN_MENU,
	HERO_SELECT,
	PLAYING,
	PAUSED,
	GAME_OVER
}

# Turn phases
enum TurnPhase {
	START,          # Check jail, use items, CD reduction
	ROLL_DICE,      # Roll and move
	LANDED,         # Process space effect
	END             # End turn, switch player
}

# Helper function to get rent multiplier
static func get_rent_multiplier(building_level: int) -> int:
	match building_level:
		0: return RENT_MULTIPLIER_EMPTY
		1: return RENT_MULTIPLIER_1_HOUSE
		2: return RENT_MULTIPLIER_2_HOUSES
		3: return RENT_MULTIPLIER_3_HOUSES
		4: return RENT_MULTIPLIER_4_HOUSES
		5: return RENT_MULTIPLIER_HOTEL
		_: return RENT_MULTIPLIER_EMPTY

# Helper function to calculate rent with cap
static func calculate_rent(base_rent: int, building_level: int, player_assets: int) -> int:
	var rent = base_rent * get_rent_multiplier(building_level)
	var max_rent = int(player_assets * RENT_CAP_PERCENT)
	return min(rent, max_rent)
