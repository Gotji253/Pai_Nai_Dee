// components/PlaceCard.js
import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';

const PlaceCard = ({ place, onSelectPlace, onToggleFavorite, isFavorite }) => (
  <div
    className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-[1.02] cursor-pointer active:scale-95"
    onClick={() => onSelectPlace(place)}
  >
    <div className="relative">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/D3D3D3/000000?text=${place.name}`; }}
      />
      <button
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md transition-colors duration-200"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(place.id); }}
      >
        <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
      </button>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 truncate">{place.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{place.category} • {place.distance}</p>
      <div className="flex items-center text-sm text-gray-600">
        <Star size={16} className="text-yellow-400 mr-1 fill-yellow-400" />
        <span>{place.rating} ({place.reviews} รีวิว)</span>
      </div>
    </div>
  </div>
);
