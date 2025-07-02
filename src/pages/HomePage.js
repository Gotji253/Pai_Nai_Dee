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
    <div className="p-4 pb-20 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">ไปไหนดี?</h1>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาสถานที่..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-60 text-gray-700 dark:text-slate-200 dark:placeholder-slate-400 transition-colors duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200
              ${selectedCategory === category
                ? 'bg-blue-600 dark:bg-blue-500 text-white dark:text-white shadow-lg font-semibold'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {searchTerm || selectedCategory !== 'ทั้งหมด' ? (
        <>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-5">ผลการค้นหา</h2>
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaces.map((place, idx) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onSelectPlace={onSelectPlace}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritePlaceIds.includes(place.id)}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-slate-400 text-center py-8">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-5">คำแนะนำสำหรับคุณ</h2>
          {recommendedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {recommendedPlaces.map((place, idx) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onSelectPlace={onSelectPlace}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favoritePlaceIds.includes(place.id)}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-slate-400 text-center py-8">ไม่มีคำแนะนำในขณะนี้ ลองเลือกความสนใจของคุณ</p>
          )}

          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-5">Hidden Gems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hiddenGems.map((place, idx) => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelectPlace={onSelectPlace}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favoritePlaceIds.includes(place.id)}
                index={idx}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
