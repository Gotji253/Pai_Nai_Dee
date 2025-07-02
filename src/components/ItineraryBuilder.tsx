import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Location, sampleLocations } from '../data/mockData'; // getLocationById might not be needed here anymore
import { useNotifier, NotificationType } from '../hooks/useNotifier';
import LocationItemCard from './LocationItemCard'; // Import the new component
import './ItineraryBuilder.css';

interface ItineraryBuilderProps {
  // initialLocations?: Location[]; // Removed, locations will be passed as a direct prop
  locations: Location[];
  onLocationsChange: (updatedLocations: Location[]) => void;
  onClearItinerary?: () => void; // Optional: if App wants to provide a clear all function
}

// Helper function to reorder a list
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({
  locations,
  onLocationsChange,
  // onClearItinerary // Example of how other handlers could be passed
}) => {
  // const [locations, setLocations] = useState<Location[]>(initialLocations || sampleLocations.slice(0, 3)); // State lifted to App.tsx
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addNotification } = useNotifier();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      locations, // Use prop
      result.source.index,
      result.destination.index
    );

    // setLocations(items); // Call prop handler instead
    onLocationsChange(items);
    addNotification('Itinerary order updated!', NotificationType.SUCCESS, 2000);
  };

  // Mock adding a new destination and triggering a notification
  const handleAddDestination = () => {
    const existingIds = locations.map(loc => loc.id);
    const newLocation = sampleLocations.find(loc => !existingIds.includes(loc.id));

    if (newLocation) {
      // setLocations([...locations, newLocation]); // Call prop handler
      onLocationsChange([...locations, newLocation]);
      addNotification(`${newLocation.name} added to itinerary!`, NotificationType.INFO);
    } else {
      addNotification('No more unique locations to add from sample data.', NotificationType.WARNING);
    }
  };

  // Mock "Time to leave" notification for the first item
  const handleTripAlert = () => {
    if (locations.length > 0) { // Use prop
      addNotification(`Reminder: Time to leave for ${locations[0].name}!`, NotificationType.INFO, 5000);
    } else {
      addNotification('Your itinerary is empty.', NotificationType.WARNING);
    }
  };

  // Simulate an action that causes loading
  const handleSimulateLoading = () => {
    setIsLoading(true);
    addNotification('Calculating routes...', NotificationType.INFO, 1800); // Show a brief notification
    setTimeout(() => {
      setIsLoading(false);
      addNotification('Route calculation complete!', NotificationType.SUCCESS);
    }, 2000); // Simulate a 2-second loading process
  };

  return (
    <div className={`itinerary-builder ${isLoading ? 'loading-active' : ''}`}>
      <div className="itinerary-header">
        <h2>Your Itinerary</h2>
        <div className="itinerary-actions">
          <button onClick={handleAddDestination} className="add-destination-btn" disabled={isLoading}>Add Destination</button>
          <button onClick={handleTripAlert} className="trip-alert-btn" disabled={isLoading}>Trip Alert</button>
          <button onClick={handleSimulateLoading} className="calculate-routes-btn" disabled={isLoading}>
            {isLoading ? 'Calculating...' : 'Calc. All Routes'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading itinerary data...</p>
        </div>
      )}

      <div className={`itinerary-content ${isLoading ? 'content-hidden' : ''}`}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppableLocations">
            {(provided, snapshot) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`location-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              >
                {locations.map((location, index) => (
                  <Draggable key={location.id} draggableId={location.id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      // LocationItemCard now renders the <li> and its content
                      <LocationItemCard
                        location={location}
                        provided={draggableProvided}
                        snapshot={draggableSnapshot}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {locations.length === 0 && !isLoading && <p>Your itinerary is empty. Add some destinations!</p>}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
    if (!result.destination) {
      return;
    }

    const items = reorder(
      locations,
      result.source.index,
      result.destination.index
    );

    setLocations(items);
  };

  return (
    <div className="itinerary-builder">
      <h2>Your Itinerary</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppableLocations">
          {(provided, snapshot) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`location-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {locations.map((location, index) => (
                <Draggable key={location.id} draggableId={location.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`location-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span className="drag-handle">☰</span>
                      <div className="location-info">
                        <strong>{location.name}</strong>
                        {location.details && <p className="location-details">{location.details}</p>}
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {locations.length === 0 && <p>Your itinerary is empty. Add some destinations!</p>}
    </div>
  );
};

export default ItineraryBuilder;
