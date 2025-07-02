// pages/HomePage.js
import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import { mockPlaces } from '../data/mockPlaces';
import { categories } from '../data/categories';

const HomePage = ({ onSelectPlace, userInterests, favoritePlaceIds, onToggleFavorite, onAddToItinerary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const filteredPlaces = mockPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedPlaces = mockPlaces.filter(place =>
    userInterests.some(interest => place.tags.includes(interest))
  );

  const hiddenGems = mockPlaces.filter(place => place.hiddenGem);

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">ไปไหนดี?</h1>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาสถานที่..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200
              ${selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {searchTerm || selectedCategory !== 'ทั้งหมด' ? (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4">ผลการค้นหา</h2>
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaces.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onSelectPlace={onSelectPlace}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritePlaceIds.includes(place.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4">คำแนะนำสำหรับคุณ</h2>
          {recommendedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {recommendedPlaces.map(place => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onSelectPlace={onSelectPlace}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritePlaceIds.includes(place.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">ไม่มีคำแนะนำในขณะนี้ ลองเลือกความสนใจของคุณ</p>
          )}

          <h2 className="text-xl font-bold text-gray-800 mb-4">Hidden Gems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hiddenGems.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelectPlace={onSelectPlace}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoritePlaceIds.includes(place.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
