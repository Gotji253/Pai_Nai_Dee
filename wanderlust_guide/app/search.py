def text_search(query: str):
    """Performs a text-based search for places."""
    # Placeholder for text search logic
    print(f"Performing text search for: {query}")
    return [{"name": "Test Place", "description": "A place for testing."}]

def voice_search():
    """Handles voice input and converts it to text for searching."""
    # Placeholder for voice search logic
    # In a real application, this would involve:
    # 1. Accessing the microphone
    # 2. Recording audio
    # 3. Sending audio to a speech-to-text API
    # 4. Receiving the transcribed text
    # 5. Calling text_search() with the transcribed text
    print("Voice search activated. Please speak your query.")
    # Simulate transcribed text
    transcribed_text = "restaurants near me"
    print(f"Transcribed text: {transcribed_text}")
    return text_search(transcribed_text)

def activity_search(places: list[dict], activity: str) -> list[dict]:
    """
    Searches for places that offer a specific activity.

    Args:
        places: A list of place dictionaries. Each place should have an 'activities' key
                with a list of strings representing available activities.
        activity: The activity to search for (e.g., "hiking", "diving").

    Returns:
        A list of places that offer the specified activity.
    """
    if not activity:
        return places # Or perhaps return an empty list, depending on desired behavior

    found_places = []
    for place in places:
        if activity.lower() in [a.lower() for a in place.get("activities", [])]:
            found_places.append(place)

    print(f"Searching for activity '{activity}'. Found {len(found_places)} matching places.")
    return found_places
