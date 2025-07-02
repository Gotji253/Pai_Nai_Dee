import React, { useState, useEffect } from 'react';
import './App.css';
import ItineraryBuilder from './components/ItineraryBuilder';
import { Location, sampleLocations } from './data/mockData';
import { useNotifier, NotificationType } from './hooks/useNotifier';
import {
  savePlanToLocalStorage,
  loadPlanFromLocalStorage,
  deletePlanFromLocalStorage,
  TravelPlan,
} from './services/planService';

function App() {
  const [currentPlanName, setCurrentPlanName] = useState<string>('My Awesome Trip'); // Example plan name
  const [locations, setLocations] = useState<Location[]>(sampleLocations.slice(0,3)); // Initial default locations
  const { addNotification } = useNotifier();

  // Load plan from localStorage on initial mount
  useEffect(() => {
    const loadInitialPlan = async () => {
      const loadedPlan = await loadPlanFromLocalStorage();
      if (loadedPlan) {
        setLocations(loadedPlan.locations);
        setCurrentPlanName(loadedPlan.name);
        addNotification(`Loaded plan "${loadedPlan.name}" from storage.`, NotificationType.INFO);
      } else {
        addNotification('No saved plan found. Starting with a default itinerary.', NotificationType.INFO);
      }
    };
    loadInitialPlan();
  }, [addNotification]); // addNotification is stable, so this runs once

  const handleLocationsChange = (updatedLocations: Location[]) => {
    setLocations(updatedLocations);
  };

  const handleSavePlan = async () => {
    if (locations.length === 0) {
      addNotification('Cannot save an empty plan.', NotificationType.WARNING);
      return;
    }
    const planToSave: TravelPlan = {
      id: 'currentPlan', // Simple ID for this mock
      name: currentPlanName,
      locations: locations,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await savePlanToLocalStorage(planToSave);
      addNotification(`Plan "${currentPlanName}" saved successfully!`, NotificationType.SUCCESS);
    } catch (error) {
      addNotification('Failed to save plan.', NotificationType.ERROR);
    }
  };

  const handleLoadPlan = async () => {
    const loadedPlan = await loadPlanFromLocalStorage();
    if (loadedPlan) {
      setLocations(loadedPlan.locations);
      setCurrentPlanName(loadedPlan.name);
      addNotification(`Plan "${loadedPlan.name}" loaded!`, NotificationType.SUCCESS);
    } else {
      addNotification('No plan found in storage to load.', NotificationType.INFO);
    }
  };

  const handleClearItinerary = () => {
    if (locations.length === 0) {
      addNotification('Itinerary is already empty.', NotificationType.INFO);
      return;
    }
    setLocations([]);
    addNotification('Itinerary cleared.', NotificationType.INFO);
    // Optionally, you might want to delete it from localStorage as well
    // deletePlanFromLocalStorage();
    // addNotification('Itinerary cleared and removed from storage.', NotificationType.INFO);
  };

  const handleRenamePlan = () => {
    const newName = prompt("Enter new name for your travel plan:", currentPlanName);
    if (newName && newName.trim() !== "") {
      setCurrentPlanName(newName.trim());
      addNotification(`Plan will be saved as "${newName.trim()}". Remember to save.`, NotificationType.INFO);
    }
  };


  return (
    <div className="app-container">
      <header>
        <h1>Travel Planner</h1>
        <div className="plan-management">
          <input
            type="text"
            value={currentPlanName}
            onChange={(e) => setCurrentPlanName(e.target.value)}
            className="plan-name-input"
            title="Current plan name"
          />
          <button onClick={handleRenamePlan} title="Rename Plan">Rename</button>
          <button onClick={handleSavePlan} title="Save Current Plan">Save Plan</button>
          <button onClick={handleLoadPlan} title="Load Plan from Storage">Load Plan</button>
          <button onClick={handleClearItinerary} title="Clear Current Itinerary">Clear Itinerary</button>
        </div>
      </header>
      <main>
        <ItineraryBuilder
          locations={locations}
          onLocationsChange={handleLocationsChange}
        />
      </main>
      <footer>
        <p>&copy; 2024 Travel Planner</p>
      </footer>
    </div>
  );
}

export default App;
      </footer>
    </div>
  );
}

export default App;
