// components/PlaceDetail.js
import React from 'react';
import Modal from './Modal';
import { MapPin, Star, Heart, Share2, PlusCircle, Info, Send, BookOpen } from 'lucide-react';

const PlaceDetail = ({ place, onClose, onAddReview, onToggleFavorite, isFavorite, onAddToItinerary }) => {
  if (!place) return null;

  const handleOpenMap = () => {
    if (place.coordinates) {
      // For Google Maps
      window.open(`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
      // For Apple Maps (iOS only)
      // window.open(`http://maps.apple.com/?ll=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
    } else {
      console.warn("No coordinates available for this place.");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={place.name}>
      <div className="space-y-4">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-64 object-cover rounded-lg shadow-sm"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/D3D3D3/000000?text=${place.name}`; }}
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <Star size={20} className="text-yellow-400 mr-1 fill-yellow-400" />
            <span>{place.rating} ({place.reviews} รีวิว)</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleFavorite(place.id)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Heart size={24} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
            </button>
            <button
              onClick={() => onAddToItinerary(place)}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors text-blue-600"
            >
              <PlusCircle size={24} />
            </button>
            <button
              onClick={() => alert('ฟังก์ชันแชร์ยังไม่เปิดใช้งาน')} // Using alert for now, replace with MessageModal
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors text-green-600"
            >
              <Share2 size={24} />
            </button>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{place.description}</p>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <p className="text-gray-600 flex items-center"><BookOpen size={18} className="mr-2 text-gray-500" />เวลาทำการ: <span className="font-medium ml-2">{place.openingHours}</span></p>
          <p className="text-gray-600 flex items-center"><Info size={18} className="mr-2 text-gray-500" />ค่าเข้าชม: <span className="font-medium ml-2">{place.admissionFee}</span></p>
          <p className="text-gray-600 flex items-center"><Send size={18} className="mr-2 text-gray-500" />ติดต่อ: <span className="font-medium ml-2">{place.contact}</span></p>
          {place.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {place.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleOpenMap}
          className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-colors mt-4"
        >
          <MapPin size={20} className="mr-2" /> เปิดในแผนที่
        </button>

        <button
          onClick={() => onAddReview(place.id)}
          className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-md hover:bg-emerald-700 transition-colors mt-2"
        >
          <Star size={20} className="mr-2" /> เพิ่มรีวิวและให้คะแนน
        </button>
      </div>
    </Modal>
  );
};

export default PlaceDetail;
