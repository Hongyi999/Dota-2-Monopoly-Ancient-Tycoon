extends Node

## Main game manager - handles all game logic and state

# Signals
signal turn_changed(player_id: int)
signal dice_rolled(die1: int, die2: int, total: int)
signal property_purchased(player_id: int, property_id: int)
signal rent_paid(from_player_id: int, to_player_id: int, amount: int)
signal player_bankrupted(player_id: int)
signal game_over(winner_id: int)

# Game state
var current_state: GameConstants.GameState = GameConstants.GameState.MAIN_MENU
var current_turn_phase: GameConstants.TurnPhase = GameConstants.TurnPhase.START

# Players
var players: Array[Player] = []
var current_player_index: int = 0
var num_players: int = 0

# Board
var properties: Array[Property] = []

# Game data
var heroes_data: Array = []
var items_data: Array = []
var rune_cards_data: Array = []
var neutral_cards_data: Array = []

# Turn tracking
var turn_number: int = 0
var last_dice_roll: Array[int] = [0, 0]

func _ready() -> void:
	load_game_data()
	setup_board()

func load_game_data() -> void:
	# Load heroes
	var heroes_file = FileAccess.open("res://data/heroes.json", FileAccess.READ)
	if heroes_file:
		var heroes_json = JSON.parse_string(heroes_file.get_as_text())
		heroes_data = heroes_json.get("heroes", [])
		heroes_file.close()

	# Load items
	var items_file = FileAccess.open("res://data/items.json", FileAccess.READ)
	if items_file:
		var items_json = JSON.parse_string(items_file.get_as_text())
		items_data = items_json.get("items", [])
		items_file.close()

	# Load cards
	var cards_file = FileAccess.open("res://data/cards.json", FileAccess.READ)
	if cards_file:
		var cards_json = JSON.parse_string(cards_file.get_as_text())
		rune_cards_data = cards_json.get("rune_cards", [])
		neutral_cards_data = cards_json.get("neutral_item_cards", [])
		cards_file.close()

	# Load properties
	var properties_file = FileAccess.open("res://data/properties.json", FileAccess.READ)
	if properties_file:
		var properties_json = JSON.parse_string(properties_file.get_as_text())
		var properties_array = properties_json.get("properties", [])

		for prop_data in properties_array:
			var prop = Property.new(prop_data)
			properties.append(prop)

		properties_file.close()

func setup_board() -> void:
	# Board setup is done in load_game_data
	pass

func start_new_game(player_count: int, selected_heroes: Array) -> void:
	num_players = player_count
	players.clear()

	# Create players
	for i in range(player_count):
		var player = Player.new(i, "Player %d" % (i + 1))

		# Assign hero
		if i < selected_heroes.size():
			var hero_id = selected_heroes[i]
			var hero_data = get_hero_data(hero_id)
			if hero_data:
				player.set_hero(hero_data)

		players.append(player)

	# Reset board
	for prop in properties:
		prop.owner_id = -1
		prop.building_level = 0
		prop.is_mortgaged = false

	# Start game
	current_player_index = 0
	turn_number = 1
	current_state = GameConstants.GameState.PLAYING
	current_turn_phase = GameConstants.TurnPhase.START

	turn_changed.emit(current_player_index)

func get_current_player() -> Player:
	if current_player_index < players.size():
		return players[current_player_index]
	return null

func get_hero_data(hero_id: String) -> Dictionary:
	for hero in heroes_data:
		if hero.get("id") == hero_id:
			return hero
	return {}

func get_item_data(item_id: String) -> Dictionary:
	for item in items_data:
		if item.get("id") == item_id:
			return item
	return {}

func roll_dice() -> Array[int]:
	if current_turn_phase != GameConstants.TurnPhase.ROLL_DICE:
		return [0, 0]

	var die1 = randi_range(GameConstants.MIN_DICE_VALUE, GameConstants.MAX_DICE_VALUE)
	var die2 = randi_range(GameConstants.MIN_DICE_VALUE, GameConstants.MAX_DICE_VALUE)

	last_dice_roll = [die1, die2]

	var player = get_current_player()
	if player:
		# Check for doubles
		if die1 == die2:
			player.consecutive_doubles += 1

			# 3 consecutive doubles = go to jail
			if player.consecutive_doubles >= GameConstants.MAX_CONSECUTIVE_DOUBLES:
				player.go_to_jail()
				dice_rolled.emit(die1, die2, die1 + die2)
				end_turn()
				return last_dice_roll
		else:
			player.consecutive_doubles = 0

		# Move player
		var total = die1 + die2
		player.move_by_spaces(total)

		dice_rolled.emit(die1, die2, total)
		current_turn_phase = GameConstants.TurnPhase.LANDED

		# Process landing
		process_landed_space()

	return last_dice_roll

func process_landed_space() -> void:
	var player = get_current_player()
	if not player:
		return

	var property = get_property_at_position(player.board_position)
	if not property:
		return

	match property.property_type:
		GameConstants.PropertyType.PROPERTY, \
		GameConstants.PropertyType.TRANSPORTATION, \
		GameConstants.PropertyType.UTILITY:
			if property.is_owned():
				# Pay rent
				if property.owner_id != player.player_id:
					pay_rent(player, property)
			# else: Can purchase (handled by UI)

		GameConstants.PropertyType.CORNER:
			handle_corner_space(player, property)

		GameConstants.PropertyType.CHANCE:
			draw_rune_card(player)

		GameConstants.PropertyType.COMMUNITY_CHEST:
			draw_neutral_card(player)

		GameConstants.PropertyType.TAX:
			pay_tax(player, property)

func get_property_at_position(position: int) -> Property:
	for prop in properties:
		if prop.id == position:
			return prop
	return null

func handle_corner_space(player: Player, property: Property) -> void:
	match property.id:
		GameConstants.FOUNTAIN_POSITION:
			# Salary already collected in move_to_position
			pass

		GameConstants.JAIL_POSITION:
			# Just visiting, nothing happens
			pass

		GameConstants.ROSHAN_PIT_POSITION:
			# Safe zone
			pass

		GameConstants.GO_TO_JAIL_POSITION:
			player.go_to_jail()

func pay_rent(player: Player, property: Property) -> void:
	var owner = players[property.owner_id]
	if not owner or owner.is_bankrupt:
		return

	var rent = calculate_rent(property, player)

	# Apply Bounty Hunter's Jinada
	if player.hero_id == "bounty_hunter":
		var max_uses = player.hero_data.get("max_uses_per_lap", 3)
		if player.jinada_uses_this_lap < max_uses:
			var discount = player.rent_discount_percent
			rent = int(rent * (1.0 - discount))
			player.jinada_uses_this_lap += 1

	# Check if player can pay
	if player.deduct_gold(rent):
		# Apply rent bonus for owner
		var rent_received = rent
		if owner.rent_bonus_percent > 0:
			rent_received = int(rent * (1.0 + owner.rent_bonus_percent))

		# Apply Divine Rapier multiplier
		if owner.has_divine_rapier:
			rent_received = int(rent_received * 1.5)

		owner.add_gold(rent_received)
		rent_paid.emit(player.player_id, owner.player_id, rent)
	else:
		# Cannot pay, trigger bankruptcy
		handle_bankruptcy(player)

func calculate_rent(property: Property, player: Player) -> int:
	var base_rent = 0

	match property.property_type:
		GameConstants.PropertyType.PROPERTY:
			base_rent = property.get_current_rent()

		GameConstants.PropertyType.UTILITY:
			var dice_sum = last_dice_roll[0] + last_dice_roll[1]
			base_rent = property.get_current_rent(dice_sum)

		GameConstants.PropertyType.TRANSPORTATION:
			# Count how many transportation properties owner has
			var owner = players[property.owner_id]
			var transport_count = 0
			for prop_id in owner.owned_properties:
				var prop = get_property_at_position(prop_id)
				if prop and prop.property_type == GameConstants.PropertyType.TRANSPORTATION:
					transport_count += 1

			if transport_count > 0 and transport_count <= property.rent_owned.size():
				base_rent = property.rent_owned[transport_count - 1]

	# Apply rent cap
	var max_rent = int(player.get_total_assets() * GameConstants.RENT_CAP_PERCENT)
	return min(base_rent, max_rent)

func pay_tax(player: Player, property: Property) -> void:
	var tax = property.tax_amount

	# Check for luxury tax (percentage based)
	if property.tax_percent > 0:
		var percent_tax = int(player.get_total_assets() * property.tax_percent)
		tax = max(tax, percent_tax)

	if player.deduct_gold(tax):
		pass  # Tax paid
	else:
		handle_bankruptcy(player)

func draw_rune_card(player: Player) -> void:
	# TODO: Implement card drawing
	pass

func draw_neutral_card(player: Player) -> void:
	# TODO: Implement card drawing
	pass

func purchase_property(player: Player, property: Property) -> bool:
	if not property.is_purchasable():
		return false

	if property.is_owned():
		return false

	if not player.deduct_gold(property.price):
		return false

	property.owner_id = player.player_id
	player.add_property(property.id)

	property_purchased.emit(player.player_id, property.id)
	return true

func handle_bankruptcy(player: Player) -> void:
	player.declare_bankruptcy()
	player_bankrupted.emit(player.player_id)

	# Check for game over
	var active_players = 0
	for p in players:
		if not p.is_bankrupt:
			active_players += 1

	if active_players <= 1:
		# Game over
		for i in range(players.size()):
			if not players[i].is_bankrupt:
				game_over.emit(i)
				break

func end_turn() -> void:
	var player = get_current_player()
	if player:
		player.reduce_cooldown()

	# Move to next player
	current_player_index = (current_player_index + 1) % num_players

	# Skip bankrupt players
	var checked = 0
	while players[current_player_index].is_bankrupt and checked < num_players:
		current_player_index = (current_player_index + 1) % num_players
		checked += 1

	# Increment turn if we've cycled through all players
	if current_player_index == 0:
		turn_number += 1

	current_turn_phase = GameConstants.TurnPhase.START
	turn_changed.emit(current_player_index)

func start_turn() -> void:
	var player = get_current_player()
	if not player:
		return

	# Check jail status
	if player.is_in_jail:
		# Handle jail logic (UI will prompt for options)
		return

	# Ready to roll dice
	current_turn_phase = GameConstants.TurnPhase.ROLL_DICE
