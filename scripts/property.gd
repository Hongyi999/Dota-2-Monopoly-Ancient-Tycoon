extends Resource
class_name Property

## Represents a single space on the game board

# Basic info
var id: int = 0
var property_name: String = ""
var property_type: GameConstants.PropertyType
var category: String = ""

# Purchase info
var price: int = 0
var base_rent: int = 0
var owner_id: int = -1  # -1 = unowned

# Color set (for building requirements)
var color_set: GameConstants.ColorSet
var color_set_ids: Array[int] = []

# Building status
var building_level: int = 0  # 0=empty, 1-4=houses, 5=hotel
var is_mortgaged: bool = false

# Special properties
var tax_amount: int = 0
var tax_percent: float = 0.0
var rent_multiplier: int = 4  # For utilities
var rent_owned: Array[int] = []  # For transportation

# Description
var description: String = ""

func _init(data: Dictionary = {}) -> void:
	if data.is_empty():
		return

	id = data.get("id", 0)
	property_name = data.get("name", "")
	category = data.get("category", "")
	description = data.get("description", "")

	# Set property type
	var type_str = data.get("type", "property")
	match type_str:
		"corner": property_type = GameConstants.PropertyType.CORNER
		"property": property_type = GameConstants.PropertyType.PROPERTY
		"transportation": property_type = GameConstants.PropertyType.TRANSPORTATION
		"utility": property_type = GameConstants.PropertyType.UTILITY
		"chance": property_type = GameConstants.PropertyType.CHANCE
		"community_chest": property_type = GameConstants.PropertyType.COMMUNITY_CHEST
		"tax": property_type = GameConstants.PropertyType.TAX
		_: property_type = GameConstants.PropertyType.PROPERTY

	# Purchase properties
	price = data.get("price", 0)
	base_rent = data.get("base_rent", 0)

	# Color set
	var color_str = data.get("color_set", "")
	color_set = _parse_color_set(color_str)

	if data.has("color_set_ids"):
		color_set_ids = data["color_set_ids"]

	# Special properties
	tax_amount = data.get("tax", 0)
	tax_percent = data.get("tax_percent", 0.0)
	rent_multiplier = data.get("rent_multiplier", 4)

	if data.has("rent_owned"):
		rent_owned = data["rent_owned"]

func _parse_color_set(color_str: String) -> GameConstants.ColorSet:
	match color_str:
		"brown": return GameConstants.ColorSet.BROWN
		"light_blue": return GameConstants.ColorSet.LIGHT_BLUE
		"pink": return GameConstants.ColorSet.PINK
		"orange": return GameConstants.ColorSet.ORANGE
		"red": return GameConstants.ColorSet.RED
		"yellow": return GameConstants.ColorSet.YELLOW
		"green": return GameConstants.ColorSet.GREEN
		"deep_blue": return GameConstants.ColorSet.DEEP_BLUE
		"independent": return GameConstants.ColorSet.INDEPENDENT
		_: return GameConstants.ColorSet.INDEPENDENT

func is_purchasable() -> bool:
	return property_type == GameConstants.PropertyType.PROPERTY or \
		   property_type == GameConstants.PropertyType.TRANSPORTATION or \
		   property_type == GameConstants.PropertyType.UTILITY

func is_owned() -> bool:
	return owner_id >= 0

func can_build() -> bool:
	# Check if this property type allows building
	if property_type != GameConstants.PropertyType.PROPERTY:
		return false

	# Must be owned
	if not is_owned():
		return false

	# Can't build if mortgaged
	if is_mortgaged:
		return false

	# Can't build hotel if already have one
	if building_level >= 5:
		return false

	return true

func get_current_rent(dice_sum: int = 0) -> int:
	if not is_owned() or is_mortgaged:
		return 0

	match property_type:
		GameConstants.PropertyType.PROPERTY:
			return base_rent * GameConstants.get_rent_multiplier(building_level)

		GameConstants.PropertyType.UTILITY:
			# Rent based on dice roll
			return dice_sum * rent_multiplier

		GameConstants.PropertyType.TRANSPORTATION:
			# Would need to know how many transportation properties owned
			# This should be calculated by game manager
			return 0

		_:
			return 0

func build_house() -> bool:
	if not can_build():
		return false

	if building_level >= GameConstants.MAX_HOUSES_PER_PROPERTY:
		return false

	building_level += 1
	return true

func build_hotel() -> bool:
	if not can_build():
		return false

	if building_level != GameConstants.MAX_HOUSES_PER_PROPERTY:
		return false

	building_level = 5
	return true

func sell_building() -> int:
	if building_level <= 0:
		return 0

	var refund = 0
	if building_level == 5:  # Hotel
		refund = int(GameConstants.HOTEL_COST * GameConstants.BUILDING_SELL_PERCENT)
	else:  # Houses
		refund = int(GameConstants.HOUSE_COST * GameConstants.BUILDING_SELL_PERCENT)

	building_level -= 1
	return refund

func get_total_building_value() -> int:
	if building_level == 0:
		return 0
	elif building_level == 5:
		return GameConstants.HOTEL_COST + (GameConstants.HOUSE_COST * 4)
	else:
		return GameConstants.HOUSE_COST * building_level

func get_total_value() -> int:
	return price + get_total_building_value()
