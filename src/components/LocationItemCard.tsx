// src/components/LocationItemCard.tsx
import React, { useState, useEffect } from 'react';
import { Location } from '../data/mockData';
import {
  fetchMockWeather,
  WeatherForecast,
  fetchMockPlaceDetails,
  PlaceDetails,
} from '../services/mockAPIs';
import './LocationItemCard.css'; // We'll create this CSS file

interface LocationItemCardProps {
  location: Location;
  // Props for drag-and-drop will be passed through from ItineraryBuilder
  provided?: any; // From react-beautiful-dnd Draggable
  snapshot?: any; // From react-beautiful-dnd Draggable
}

const LocationItemCard: React.FC<LocationItemCardProps> = ({
  location,
  provided,
  snapshot,
}) => {
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    const loadAsyncData = async () => {
      setIsLoadingData(true);
      try {
        const [weatherData, placeDetailsData] = await Promise.all([
          fetchMockWeather(location),
          fetchMockPlaceDetails(location),
        ]);
        setWeather(weatherData);
        setDetails(placeDetailsData);
      } catch (error) {
        console.error(`Failed to load data for ${location.name}:`, error);
        // Optionally set error states here
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAsyncData();
  }, [location]); // Reload if the location prop changes

  return (
    <li
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`location-item ${snapshot?.isDragging ? 'dragging' : ''}`}
      style={{ ...provided?.draggableProps?.style }}
    >
      <span className="drag-handle">☰</span>
      <div className="location-info">
        <strong>{location.name}</strong>
        {location.details && <p className="location-details-prop">{location.details}</p>}

        {isLoadingData && <div className="inline-loader">Loading details...</div>}

        {!isLoadingData && (
          <div className="additional-details">
            {weather && (
              <div className="weather-info">
                <span title={weather.description}>
                  {weather.iconCode && <img src={`https://openweathermap.org/img/wn/${weather.iconCode}.png`} alt={weather.description} className="weather-icon" />}
                  {weather.temperatureC}°C, {weather.description}
                </span>
              </div>
            )}
            {details && (
              <div className="place-extra-info">
                {details.rating && (
                  <span className="rating" title={`${details.reviewsCount || ''} reviews`}>
                    ⭐ {details.rating.toFixed(1)}
                  </span>
                )}
                {details.openingHours && <p className="opening-hours">Hours: {details.openingHours}</p>}
                {details.website && (
                  <a href={details.website} target="_blank" rel="noopener noreferrer" className="place-website">
                    Website
                  </a>
                )}
                {details.photos && details.photos.length > 0 && (
                  <div className="photo-gallery">
                    {details.photos.slice(0, 1).map((photoUrl, index) => ( // Show only first photo for brevity
                      <img key={index} src={photoUrl} alt={`${location.name} photo ${index + 1}`} className="place-photo" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

export default LocationItemCard;
