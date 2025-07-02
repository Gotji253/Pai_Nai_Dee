# Define available filters
DETAILED_FILTERS = {
    "suitable_for_kids": "Suitable for Kids",
    "pet_friendly": "Pet-Friendly",
    "parking_available": "Parking Available",
    "wheelchair_accessible": "Wheelchair Accessible",
    "wifi_available": "Wi-Fi Available",
}

def apply_filters(places: list[dict], active_filters: set[str]) -> list[dict]:
    """
    Applies selected filters to a list of places.

    Args:
        places: A list of dictionaries, where each dictionary represents a place
                and should have keys corresponding to the filter IDs (e.g., "pet_friendly": True).
        active_filters: A set of strings representing the IDs of filters to apply.

    Returns:
        A new list of places that match all active filters.
    """
    if not active_filters:
        return places

    filtered_places = []
    for place in places:
        match = True
        for f_id in active_filters:
            if not place.get(f_id, False):  # Assumes filterable attributes are boolean
                match = False
                break
        if match:
            filtered_places.append(place)

    print(f"Applied filters: {active_filters}. Found {len(filtered_places)} matching places.")
    return filtered_places

def get_available_filters() -> dict:
    """Returns a dictionary of available filters."""
    return DETAILED_FILTERS
