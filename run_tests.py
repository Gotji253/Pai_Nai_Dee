import unittest
import os
import sys

if __name__ == "__main__":
    # Add the 'wanderlust_guide' directory to sys.path so that 'app' can be imported
    # Assuming run_tests.py is in the repository root, and wanderlust_guide is a subdirectory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    wanderlust_guide_path = os.path.join(current_dir, "wanderlust_guide")

    if wanderlust_guide_path not in sys.path:
        sys.path.insert(0, wanderlust_guide_path)

    # Define the directory containing the tests
    test_dir = os.path.join(wanderlust_guide_path, "tests")

    # Create a TestLoader instance
    loader = unittest.TestLoader()

    # Discover tests in the specified directory
    # The pattern 'test_*.py' will find files like test_filters.py, test_search.py
    suite = loader.discover(start_dir=test_dir, pattern="test_*.py")

    # Create a TextTestRunner instance
    # verbosity=2 provides more detailed output
    runner = unittest.TextTestRunner(verbosity=2)

    # Run the tests
    result = runner.run(suite)

    # Exit with a status code indicating success or failure
    # exit(0) if all tests pass, exit(1) if any test fails
    sys.exit(not result.wasSuccessful())
