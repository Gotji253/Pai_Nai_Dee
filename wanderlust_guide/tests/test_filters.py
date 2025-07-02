import unittest
from app.filters import apply_filters, get_available_filters, DETAILED_FILTERS

# Sample places data for testing
SAMPLE_PLACES_DATA = [
    {"id": 1, "name": "Place A", "suitable_for_kids": True, "pet_friendly": False, "parking_available": True, "wifi_available": False, "wheelchair_accessible": True},
    {"id": 2, "name": "Place B", "suitable_for_kids": False, "pet_friendly": True, "parking_available": True, "wifi_available": True, "wheelchair_accessible": False},
    {"id": 3, "name": "Place C", "suitable_for_kids": True, "pet_friendly": True, "parking_available": False, "wifi_available": True, "wheelchair_accessible": True},
    {"id": 4, "name": "Place D", "suitable_for_kids": False, "pet_friendly": False, "parking_available": False, "wifi_available": False, "wheelchair_accessible": False},
    {"id": 5, "name": "Place E", "pet_friendly": True}, # Missing some filter keys, should default to False
]

class TestFilters(unittest.TestCase):

    def test_get_available_filters(self):
        """Test that get_available_filters returns the correct dictionary."""
        self.assertEqual(get_available_filters(), DETAILED_FILTERS)

    def test_apply_filters_empty_filters(self):
        """Test applying no filters returns all places."""
        filtered = apply_filters(SAMPLE_PLACES_DATA, set())
        self.assertEqual(len(filtered), len(SAMPLE_PLACES_DATA))

    def test_apply_single_filter_pet_friendly(self):
        """Test applying a single filter: pet_friendly."""
        active_filters = {"pet_friendly"}
        filtered = apply_filters(SAMPLE_PLACES_DATA, active_filters)
        self.assertEqual(len(filtered), 3) # Place B, C, E
        for place in filtered:
            self.assertTrue(place.get("pet_friendly"))

    def test_apply_single_filter_suitable_for_kids(self):
        """Test applying a single filter: suitable_for_kids."""
        active_filters = {"suitable_for_kids"}
        filtered = apply_filters(SAMPLE_PLACES_DATA, active_filters)
        self.assertEqual(len(filtered), 2) # Place A, C
        for place in filtered:
            self.assertTrue(place.get("suitable_for_kids"))

    def test_apply_multiple_filters(self):
        """Test applying multiple filters: pet_friendly AND wifi_available."""
        active_filters = {"pet_friendly", "wifi_available"}
        filtered = apply_filters(SAMPLE_PLACES_DATA, active_filters)
        self.assertEqual(len(filtered), 2) # Place B, C
        for place in filtered:
            self.assertTrue(place.get("pet_friendly"))
            self.assertTrue(place.get("wifi_available"))

    def test_apply_multiple_filters_no_match(self):
        """Test applying multiple filters that result in no matches."""
        # No place is suitable_for_kids AND pet_friendly AND wifi_available AND parking_available
        active_filters = {"suitable_for_kids", "pet_friendly", "wifi_available", "parking_available"}
        filtered = apply_filters(SAMPLE_PLACES_DATA, active_filters)
        self.assertEqual(len(filtered), 0)

    def test_apply_filter_with_missing_keys_in_data(self):
        """Test filters when place data might be missing some boolean keys (should default to False)."""
        active_filters = {"wifi_available"} # Place E is missing "wifi_available"
        filtered = apply_filters(SAMPLE_PLACES_DATA, active_filters)

        # Expected: Place B, Place C
        self.assertEqual(len(filtered), 2)
        place_names = {p["name"] for p in filtered}
        self.assertIn("Place B", place_names)
        self.assertIn("Place C", place_names)
        self.assertNotIn("Place E", place_names) # Place E has no wifi_available, so it's not a match

    def test_apply_filters_empty_places_list(self):
        """Test applying filters to an empty list of places."""
        filtered = apply_filters([], {"pet_friendly"})
        self.assertEqual(len(filtered), 0)

if __name__ == '__main__':
    unittest.main()
