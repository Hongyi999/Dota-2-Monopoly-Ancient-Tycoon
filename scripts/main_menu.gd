extends Control

## Main menu screen

func _ready() -> void:
	# Center the menu
	pass

func _on_new_game_button_pressed() -> void:
	# Load hero selection scene
	get_tree().change_scene_to_file("res://scenes/hero_select.tscn")

func _on_options_button_pressed() -> void:
	# TODO: Implement options menu
	print("Options menu not yet implemented")

func _on_quit_button_pressed() -> void:
	get_tree().quit()
