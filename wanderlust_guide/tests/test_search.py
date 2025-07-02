import unittest
from unittest.mock import patch
from app.search import text_search, voice_search, activity_search

# Sample data for search tests
SAMPLE_PLACES_FOR_SEARCH = [
    {"id": 1, "name": "Sunny Park", "description": "A beautiful park with playgrounds and trails.", "activities": ["hiking", "picnic", "playgrounds"]},
    {"id": 2, "name": "Downtown Cafe", "description": "Cozy cafe with great coffee and snacks.", "activities": ["coffee", "reading"]},
    {"id": 3, "name": "Mountain Peak Trail", "description": "Challenging hiking trail with scenic views.", "activities": ["hiking", "sightseeing"]},
    {"id": 4, "name": "City Library", "description": "Quiet library with a vast collection of books.", "activities": ["reading", "study"]},
    {"id": 5, "name": "Adventure Sports Center", "description": "Offers various adventure sports like rock climbing and kayaking.", "activities": ["rock climbing", "kayaking", "hiking"]},
]

class TestSearch(unittest.TestCase):

    @patch('app.search.print') # Mock print to avoid console output during tests
    def test_text_search_placeholder(self, mock_print):
        """Test the placeholder text_search function."""
        # Current text_search is a placeholder, returns a fixed list
        results = text_search("anything")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Test Place")
        # Example: mock_print.assert_any_call("Performing text search for: anything")

    @patch('app.search.text_search') # Mock text_search to check if voice_search calls it
    @patch('app.search.print')
    def test_voice_search_calls_text_search(self, mock_print, mock_text_search):
        """Test that voice_search calls text_search with simulated transcribed text."""
        mock_text_search.return_value = [{"name": "From Voice Test", "description": "Tested"}]

        results = voice_search()

        mock_text_search.assert_called_once_with("restaurants near me")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "From Voice Test")
        # Example: mock_print.assert_any_call("Voice search activated. Please speak your query.")
        # Example: mock_print.assert_any_call("Transcribed text: restaurants near me")

    @patch('app.search.print')
    def test_activity_search_found(self, mock_print):
        """Test activity_search when the activity exists."""
        results = activity_search(SAMPLE_PLACES_FOR_SEARCH, "hiking")
        self.assertEqual(len(results), 3) # Sunny Park, Mountain Peak Trail, Adventure Sports Center
        place_names = {p["name"] for p in results}
        self.assertIn("Sunny Park", place_names)
        self.assertIn("Mountain Peak Trail", place_names)
        self.assertIn("Adventure Sports Center", place_names)

    @patch('app.search.print')
    def test_activity_search_not_found(self, mock_print):
        """Test activity_search when the activity does not exist."""
        results = activity_search(SAMPLE_PLACES_FOR_SEARCH, "swimming")
        self.assertEqual(len(results), 0)

    @patch('app.search.print')
    def test_activity_search_case_insensitive(self, mock_print):
        """Test activity_search is case-insensitive."""
        results = activity_search(SAMPLE_PLACES_FOR_SEARCH, "HiKiNg")
        self.assertEqual(len(results), 3)
        place_names = {p["name"] for p in results}
        self.assertIn("Sunny Park", place_names)

    @patch('app.search.print')
    def test_activity_search_empty_activity_string(self, mock_print):
        """Test activity_search with an empty activity string (should return all places)."""
        results = activity_search(SAMPLE_PLACES_FOR_SEARCH, "")
        self.assertEqual(len(results), len(SAMPLE_PLACES_FOR_SEARCH))

    @patch('app.search.print')
    def test_activity_search_empty_places_list(self, mock_print):
        """Test activity_search with an empty list of places."""
        results = activity_search([], "hiking")
        self.assertEqual(len(results), 0)

    @patch('app.search.print')
    def test_activity_search_places_without_activities_key(self, mock_print):
        """Test activity_search when places might be missing the 'activities' key."""
        places_mixed = [
            {"id": 1, "name": "Park A", "activities": ["hiking"]},
            {"id": 2, "name": "Cafe B"}, # No 'activities' key
            {"id": 3, "name": "Trail C", "activities": ["running", "hiking"]}
        ]
        results = activity_search(places_mixed, "hiking")
        self.assertEqual(len(results), 2)
        place_names = {p["name"] for p in results}
        self.assertIn("Park A", place_names)
        self.assertIn("Trail C", place_names)
        self.assertNotIn("Cafe B", place_names)

if __name__ == '__main__':
    # It's better to run tests using python -m unittest discover -s tests -p "test_*.py"
    # from the wanderlust_guide directory, but this allows running the file directly.
    unittest.main()
