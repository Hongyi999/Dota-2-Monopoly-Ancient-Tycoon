extends Node
class_name Player

## Represents a player in the game

# Player info
var player_id: int = 0
var player_name: String = ""
var player_color: Color = Color.WHITE

# Hero
var hero_id: String = ""
var hero_name: String = ""
var hero_data: Dictionary = {}

# Position and status
var board_position: int = 0
var gold: int = GameConstants.STARTING_GOLD
var is_in_jail: bool = false
var jail_turns_remaining: int = 0

# Properties and buildings
var owned_properties: Array[int] = []  # Property IDs
var items: Array[String] = []  # Item IDs (max 2)

# Hero ability cooldown
var ability_cooldown: int = 0
var ability_ready: bool = true

# Special states
var is_bankrupt: bool = false
var has_used_buyback: bool = false
var consecutive_doubles: int = 0

# Passive bonuses (from hero/items)
var salary_bonus: int = 0
var rent_bonus_percent: float = 0.0
var rent_discount_percent: float = 0.0

# Special items/effects
var has_aegis: bool = false
var has_divine_rapier: bool = false
var stored_rune_card: String = ""  # For Bottle

# Jinada tracking (for Bounty Hunter)
var jinada_uses_this_lap: int = 0

func _init(p_id: int, p_name: String) -> void:
	player_id = p_id
	player_name = p_name

	if p_id < GameConstants.PLAYER_COLORS.size():
		player_color = GameConstants.PLAYER_COLORS[p_id]

func set_hero(hero_dict: Dictionary) -> void:
	hero_id = hero_dict.get("id", "")
	hero_name = hero_dict.get("name", "")
	hero_data = hero_dict

	# Set passive bonuses based on hero
	if hero_id == "alchemist":
		salary_bonus = hero_dict.get("bonus_salary", 0)
		rent_bonus_percent = hero_dict.get("bonus_rent_percent", 0.0) / 100.0
	elif hero_id == "bounty_hunter":
		rent_discount_percent = hero_dict.get("rent_discount_percent", 0.0) / 100.0

func move_to_position(new_position: int) -> void:
	var old_position = board_position
	board_position = new_position % GameConstants.TOTAL_SPACES

	# Check if passed Fountain (position 0)
	if old_position > board_position:
		collect_salary()

	# Reset Jinada uses if passed fountain
	if old_position > board_position and hero_id == "bounty_hunter":
		jinada_uses_this_lap = 0

func move_by_spaces(spaces: int) -> void:
	move_to_position(board_position + spaces)

func collect_salary() -> int:
	var total_salary = GameConstants.BASE_SALARY + salary_bonus

	# Check for Wraith Band
	if items.has("wraith_band"):
		total_salary += 50

	gold += total_salary
	return total_salary

func add_gold(amount: int) -> void:
	gold += amount

func deduct_gold(amount: int) -> bool:
	if gold >= amount:
		gold -= amount
		return true
	return false

func get_total_assets() -> int:
	# Would need access to game_manager to calculate property values
	# For now, just return gold
	return gold

func add_property(property_id: int) -> void:
	if not owned_properties.has(property_id):
		owned_properties.append(property_id)

func remove_property(property_id: int) -> void:
	owned_properties.erase(property_id)

func owns_property(property_id: int) -> bool:
	return owned_properties.has(property_id)

func can_add_item() -> bool:
	return items.size() < GameConstants.MAX_ITEMS_PER_PLAYER

func add_item(item_id: String) -> bool:
	if can_add_item():
		items.append(item_id)

		# Apply item effects
		if item_id == "divine_rapier":
			has_divine_rapier = true

		return true
	return false

func remove_item(item_id: String) -> void:
	items.erase(item_id)

	# Remove item effects
	if item_id == "divine_rapier":
		has_divine_rapier = false

func go_to_jail() -> void:
	is_in_jail = true
	jail_turns_remaining = 3  # Can try to escape for 3 turns
	board_position = GameConstants.JAIL_POSITION
	consecutive_doubles = 0

func exit_jail() -> void:
	is_in_jail = false
	jail_turns_remaining = 0

func pay_bail() -> bool:
	if deduct_gold(GameConstants.JAIL_BAIL):
		exit_jail()
		return true
	return false

func use_ability() -> bool:
	if not ability_ready or ability_cooldown > 0:
		return false

	ability_ready = false
	ability_cooldown = hero_data.get("cooldown", 0)
	return true

func reduce_cooldown() -> void:
	if ability_cooldown > 0:
		ability_cooldown -= 1

		# Check for Aghanim's Shard (reduces CD by 1)
		if items.has("aghanims_shard"):
			ability_cooldown = max(0, ability_cooldown - 1)

	if ability_cooldown == 0:
		ability_ready = true

func declare_bankruptcy() -> void:
	is_bankrupt = true

func attempt_buyback() -> bool:
	if has_used_buyback:
		return false

	if gold < GameConstants.BUYBACK_COST:
		return false

	gold -= GameConstants.BUYBACK_COST
	gold = GameConstants.BUYBACK_STARTING_GOLD
	has_used_buyback = true
	is_bankrupt = false

	# Clear all properties (handled by game manager)
	owned_properties.clear()

	# Move to start
	board_position = GameConstants.STARTING_POSITION

	return true

func get_status_string() -> String:
	var status = "%s (%s) - %dG" % [player_name, hero_name, gold]
	if is_in_jail:
		status += " [JAILED]"
	if is_bankrupt:
		status += " [BANKRUPT]"
	return status
