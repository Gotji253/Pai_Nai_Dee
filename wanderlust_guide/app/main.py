from .search import voice_search, text_search

def main():
    """Main function to run the Wanderlust Guide application."""
    print("Welcome to Wanderlust Guide!")

    # Simulate user choosing voice search
    print("\\nSimulating voice search:")
    voice_results = voice_search()
    if voice_results:
        print("\\nVoice Search Results:")
        for place in voice_results:
            print(f"- {place.get('name')}: {place.get('description')}")

    # Simulate user performing a text search
    print("\\nSimulating text search:")
    query = "parks with playgrounds"
    text_results = text_search(query)
    if text_results:
        print("\\nText Search Results:")
        for place in text_results:
            print(f"- {place.get('name')}: {place.get('description')}")

    # Simulate applying detailed filters
    print("\\nSimulating detailed filters:")
    # Let's assume text_search now returns places with filterable attributes
    # For demonstration, we'll create a sample list of places
    # Adding 'activities', 'latitude', and 'longitude' to sample_places
    sample_places = [
        {"name": "Adventure Park", "description": "Fun for all ages", "suitable_for_kids": True, "parking_available": True, "pet_friendly": False, "activities": ["hiking", "zip-lining", "rock climbing"], "latitude": 34.0522, "longitude": -118.2437},
        {"name": "Quiet Cafe", "description": "Relax and unwind", "wifi_available": True, "pet_friendly": True, "suitable_for_kids": False, "activities": ["reading", "board games"], "latitude": 34.0550, "longitude": -118.2500},
        {"name": "City Museum", "description": "Historical artifacts", "wheelchair_accessible": True, "parking_available": True, "activities": ["guided tours", "exhibits"], "latitude": 34.0500, "longitude": -118.2400},
        {"name": "Dog Haven", "description": "A park for dogs and their owners", "pet_friendly": True, "parking_available": True, "suitable_for_kids": True, "activities": ["dog walking", "fetch"], "latitude": 34.0600, "longitude": -118.2600},
        {"name": "Tech Hub Cafe", "description": "Work and coffee", "wifi_available": True, "wheelchair_accessible": True, "pet_friendly": False, "activities": ["coding", "meetings"], "latitude": 34.0480, "longitude": -118.2450},
        {"name": "Mountain Trails", "description": "Scenic hiking paths", "activities": ["hiking", "bird watching", "cycling"], "parking_available": True, "latitude": 34.1500, "longitude": -118.3000},
        {"name": "Beach Resort", "description": "Sun and Sand", "activities": ["diving", "swimming", "surfing"], "wifi_available": True, "suitable_for_kids": True, "latitude": 33.9500, "longitude": -118.4000}
    ]

    from .filters import apply_filters, get_available_filters

    available_filters = get_available_filters()
    print("Available filters:", available_filters)

    # Simulate user selecting some filters
    selected_filter_ids = {"pet_friendly", "parking_available"}
    print(f"User selected filters: {selected_filter_ids}")

    filtered_results = apply_filters(sample_places, selected_filter_ids)
    if filtered_results:
        print("\\nFiltered Search Results:")
        for place in filtered_results:
            print(f"- {place.get('name')}: {place.get('description')}")
    else:
        print("No places match the selected filters.")

    # Simulate activity search
    print("\\nSimulating activity search:")
    from .search import activity_search # Already imported text_search, voice_search

    # User wants to find places for "hiking"
    activity_to_find = "hiking"
    activity_results = activity_search(sample_places, activity_to_find)
    if activity_results:
        print(f"\\nPlaces offering '{activity_to_find}':")
        for place in activity_results:
            print(f"- {place.get('name')}: Activities: {', '.join(place.get('activities', []))}")
    else:
        print(f"No places found offering the activity: {activity_to_find}")

    # User wants to find places for "diving" using the results from "pet_friendly" and "parking_available"
    activity_to_find_in_filtered = "diving"
    # Apply activity search on the previously filtered results
    activity_in_filtered_results = activity_search(filtered_results, activity_to_find_in_filtered)
    if activity_in_filtered_results:
        print(f"\\nPlaces from previous filter (pet_friendly, parking_available) that also offer '{activity_to_find_in_filtered}':")
        for place in activity_in_filtered_results:
            print(f"- {place.get('name')}: Activities: {', '.join(place.get('activities', []))}")
    else:
        print(f"No places from the previous filter match the activity: {activity_to_find_in_filtered}")

    # Simulate interactive map functionalities
    print("\\nSimulating Interactive Map Features:")
    from .map_utils import find_places_in_map_area, get_map_clusters, get_place_coordinates

    # 1. User pans/zooms map to a specific area
    # Define a bounding box for the map view (e.g., downtown Los Angeles area)
    # Coordinates: (latitude, longitude)
    ne_corner = (34.0700, -118.2200) # North-East corner
    sw_corner = (34.0300, -118.2700) # South-West corner
    print(f"Simulating map view bounded by NE:{ne_corner} and SW:{sw_corner}")

    visible_places_on_map = find_places_in_map_area(sample_places, ne_corner, sw_corner)
    if visible_places_on_map:
        print("Places visible in the current map area:")
        for place in visible_places_on_map:
            print(f"- {place['name']} (Lat: {place.get('latitude')}, Lon: {place.get('longitude')})")
    else:
        print("No places found in the current map area.")

    # 2. Display clusters of nearby places based on zoom level
    print("\\nSimulating map clustering:")
    # Simulate a moderately zoomed-out level
    zoom_level_far = 10
    clusters_far = get_map_clusters(sample_places, zoom_level_far)
    print(f"Clusters/Data at zoom level {zoom_level_far}: {clusters_far}")

    # Simulate a more zoomed-in level
    zoom_level_close = 16
    clusters_close = get_map_clusters(visible_places_on_map, zoom_level_close) # Use places in view for closer zoom
    print(f"Clusters/Data at zoom level {zoom_level_close} (for visible places): {clusters_close}")

    # 3. Search for a place and get its coordinates (e.g., to center map on it)
    place_to_find = "City Museum"
    coords = get_place_coordinates(place_to_find, sample_places)
    if coords and None not in coords:
        print(f"Coordinates for '{place_to_find}': Latitude: {coords[0]}, Longitude: {coords[1]}. (Map could center here)")
    else:
        print(f"Could not find coordinates for '{place_to_find}'.")


if __name__ == "__main__":
    main()
