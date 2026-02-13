extends Node

## Main game scene controller

@onready var game_manager = $GameManager
@onready var turn_label = $UI/MarginContainer/VBoxContainer/TopBar/TurnLabel
@onready var current_player_label = $UI/MarginContainer/VBoxContainer/TopBar/CurrentPlayerLabel
@onready var player_info_text = $UI/MarginContainer/VBoxContainer/MainArea/RightPanel/PlayerInfoPanel/PlayerInfoText
@onready var event_log_text = $UI/MarginContainer/VBoxContainer/MainArea/RightPanel/EventLogPanel/EventLogText
@onready var roll_dice_button = $UI/MarginContainer/VBoxContainer/BottomBar/RollDiceButton
@onready var end_turn_button = $UI/MarginContainer/VBoxContainer/BottomBar/EndTurnButton

var event_log: Array[String] = []

func _ready() -> void:
	# Connect game manager signals
	game_manager.turn_changed.connect(_on_turn_changed)
	game_manager.dice_rolled.connect(_on_dice_rolled)
	game_manager.property_purchased.connect(_on_property_purchased)
	game_manager.rent_paid.connect(_on_rent_paid)
	game_manager.player_bankrupted.connect(_on_player_bankrupted)
	game_manager.game_over.connect(_on_game_over)

	# Start a test game
	start_test_game()

func start_test_game() -> void:
	# For testing, start with 2 players and random heroes
	var test_heroes = ["alchemist", "axe"]
	game_manager.start_new_game(2, test_heroes)

	add_event_log("Game started!")
	update_ui()

func update_ui() -> void:
	# Update turn counter
	turn_label.text = "Turn: %d" % game_manager.turn_number

	# Update current player
	var current_player = game_manager.get_current_player()
	if current_player:
		current_player_label.text = "Current Player: %s (%s)" % [current_player.player_name, current_player.hero_name]

		# Update player info
		update_player_info(current_player)

	# Update button states
	update_button_states()

func update_player_info(player: Player) -> void:
	var info = ""
	info += "[b]%s[/b] (%s)\n" % [player.player_name, player.hero_name]
	info += "Gold: %dG\n" % player.gold
	info += "Position: %d\n" % player.board_position
	info += "Properties: %d\n" % player.owned_properties.size()

	if player.is_in_jail:
		info += "\n[color=red]IN JAIL[/color]"

	if player.ability_cooldown > 0:
		info += "\nAbility CD: %d" % player.ability_cooldown
	else:
		info += "\n[color=green]Ability Ready[/color]"

	player_info_text.text = info

func update_button_states() -> void:
	var can_roll = game_manager.current_turn_phase == GameConstants.TurnPhase.ROLL_DICE
	roll_dice_button.disabled = not can_roll

func add_event_log(message: String) -> void:
	event_log.append(message)

	# Keep only last 20 messages
	if event_log.size() > 20:
		event_log.remove_at(0)

	# Update display
	var log_text = ""
	for msg in event_log:
		log_text += "• " + msg + "\n"

	event_log_text.text = log_text

func _on_roll_dice_button_pressed() -> void:
	var dice = game_manager.roll_dice()
	if dice[0] > 0:
		add_event_log("Rolled: %d + %d = %d" % [dice[0], dice[1], dice[0] + dice[1]])

		var player = game_manager.get_current_player()
		if player:
			add_event_log("%s moved to position %d" % [player.player_name, player.board_position])

	update_ui()

func _on_end_turn_button_pressed() -> void:
	game_manager.end_turn()
	add_event_log("Turn ended")
	update_ui()

func _on_back_to_menu_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

# Signal handlers
func _on_turn_changed(player_id: int) -> void:
	var player = game_manager.players[player_id]
	add_event_log("[b]%s's turn[/b]" % player.player_name)

	# Start the turn
	game_manager.start_turn()
	update_ui()

func _on_dice_rolled(die1: int, die2: int, total: int) -> void:
	update_ui()

func _on_property_purchased(player_id: int, property_id: int) -> void:
	var player = game_manager.players[player_id]
	var property = game_manager.get_property_at_position(property_id)

	if player and property:
		add_event_log("%s purchased %s for %dG" % [player.player_name, property.property_name, property.price])

	update_ui()

func _on_rent_paid(from_player_id: int, to_player_id: int, amount: int) -> void:
	var from_player = game_manager.players[from_player_id]
	var to_player = game_manager.players[to_player_id]

	if from_player and to_player:
		add_event_log("%s paid %dG rent to %s" % [from_player.player_name, amount, to_player.player_name])

	update_ui()

func _on_player_bankrupted(player_id: int) -> void:
	var player = game_manager.players[player_id]
	if player:
		add_event_log("[color=red]%s went bankrupt![/color]" % player.player_name)

	update_ui()

func _on_game_over(winner_id: int) -> void:
	var winner = game_manager.players[winner_id]
	if winner:
		add_event_log("[color=gold][b]GAME OVER! %s WINS![/b][/color]" % winner.player_name)

	# Disable all buttons
	roll_dice_button.disabled = true
	end_turn_button.disabled = true

	update_ui()
