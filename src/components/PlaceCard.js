// components/PlaceCard.js
import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';

const PlaceCard = ({ place, onSelectPlace, onToggleFavorite, isFavorite, index }) => (
  <div
    className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.03] cursor-pointer active:scale-95 border border-slate-100 dark:border-slate-700 animate-scale-in"
    onClick={() => onSelectPlace(place)}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="relative">
      <img
        src={place.image}
        alt={place.name}
        className="w-full h-48 object-cover rounded-t-xl"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/D3D3D3/000000?text=${place.name}`; }}
        loading="lazy" // Added lazy loading for images
      />
      <button
        className="absolute top-3 right-3 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-600"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(place.id); }}
      >
        <Heart size={20} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 dark:text-slate-400'} />
      </button>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 truncate">{place.name}</h3>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{place.category} • {place.distance}</p>
      <div className="flex items-center text-sm text-gray-600 dark:text-slate-300">
        <Star size={16} className="text-yellow-400 mr-1 fill-yellow-400" /> {/* Star color remains consistent */}
        <span>{place.rating} ({place.reviews} รีวิว)</span>
      </div>
    </div>
  </div>
);
