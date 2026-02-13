extends Control

## Hero selection screen

@onready var player_count_label = $VBoxContainer/PlayerCountLabel
@onready var player_count_slider = $VBoxContainer/PlayerCountSlider
@onready var hero_grid = $VBoxContainer/HeroGridContainer
@onready var start_button = $VBoxContainer/HBoxContainer/StartButton

var player_count: int = 2
var selected_heroes: Array[String] = []
var hero_buttons: Array[Button] = []

# Load heroes from data
var heroes_data: Array = []

func _ready() -> void:
	load_heroes_data()
	create_hero_buttons()
	update_ui()

func load_heroes_data() -> void:
	var heroes_file = FileAccess.open("res://data/heroes.json", FileAccess.READ)
	if heroes_file:
		var heroes_json = JSON.parse_string(heroes_file.get_as_text())
		heroes_data = heroes_json.get("heroes", [])
		heroes_file.close()

func create_hero_buttons() -> void:
	# Clear existing buttons
	for child in hero_grid.get_children():
		child.queue_free()

	hero_buttons.clear()

	# Create a button for each hero
	for hero in heroes_data:
		var button = Button.new()
		button.text = hero.get("name", "Unknown")
		button.custom_minimum_size = Vector2(200, 150)
		button.toggle_mode = true

		# Store hero ID in metadata
		button.set_meta("hero_id", hero.get("id", ""))

		# Connect button press
		button.toggled.connect(_on_hero_button_toggled.bind(button))

		hero_grid.add_child(button)
		hero_buttons.append(button)

func _on_hero_button_toggled(toggled_on: bool, button: Button) -> void:
	var hero_id = button.get_meta("hero_id", "")

	if toggled_on:
		# Check if we can select more heroes
		if selected_heroes.size() >= player_count:
			# Deselect the first selected hero
			var first_hero = selected_heroes[0]
			selected_heroes.remove_at(0)

			# Find and deselect the button
			for btn in hero_buttons:
				if btn.get_meta("hero_id") == first_hero:
					btn.button_pressed = false
					break

		if not selected_heroes.has(hero_id):
			selected_heroes.append(hero_id)
	else:
		selected_heroes.erase(hero_id)

	update_ui()

func _on_player_count_slider_value_changed(value: float) -> void:
	player_count = int(value)
	player_count_label.text = "Number of Players: %d" % player_count

	# Adjust selected heroes if needed
	while selected_heroes.size() > player_count:
		var removed_hero = selected_heroes.pop_back()

		# Deselect the button
		for btn in hero_buttons:
			if btn.get_meta("hero_id") == removed_hero:
				btn.button_pressed = false
				break

	update_ui()

func update_ui() -> void:
	# Enable start button only if we have enough heroes selected
	start_button.disabled = selected_heroes.size() < player_count

	# Update button labels to show selection order
	for i in range(hero_buttons.size()):
		var button = hero_buttons[i]
		var hero_id = button.get_meta("hero_id")
		var hero_name = heroes_data[i].get("name", "Unknown")

		if selected_heroes.has(hero_id):
			var player_num = selected_heroes.find(hero_id) + 1
			button.text = "P%d: %s" % [player_num, hero_name]
		else:
			button.text = hero_name

func _on_back_button_pressed() -> void:
	get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

func _on_start_button_pressed() -> void:
	if selected_heroes.size() < player_count:
		return

	# Start the game with selected heroes
	var game_data = {
		"player_count": player_count,
		"selected_heroes": selected_heroes
	}

	# Store in a singleton or pass to next scene
	# For now, we'll just change to the game scene
	get_tree().change_scene_to_file("res://scenes/game.tscn")
