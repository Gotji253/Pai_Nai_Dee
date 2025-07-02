// pages/ItineraryPage.js
import React, { useState } from 'react';
import MessageModal from '../components/MessageModal';
import { Calendar, X } from 'lucide-react';

const ItineraryPage = ({ itineraryPlaces, onRemoveFromItinerary }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleRemove = (placeId) => {
    onRemoveFromItinerary(placeId);
    setMessage("นำสถานที่ออกจากแผนการเดินทางแล้ว");
    setMessageType("success");
    setShowMessageModal(true);
  };

  return (
    <>
      <div className="p-4 pb-20 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">แผนการเดินทางของฉัน</h1>

        {itineraryPlaces.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">ยังไม่มีสถานที่ในแผนการเดินทางของคุณ</p>
            <p className="text-gray-500 mt-2">ลองเพิ่มสถานที่จากหน้าหลัก</p>
          </div>
        ) : (
          <div className="space-y-4">
            {itineraryPlaces.map((place) => (
              <div key={place.id} className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/D3D3D3/000000?text=${place.name}`; }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{place.name}</h3>
                  <p className="text-sm text-gray-500">{place.category} • {place.distance}</p>
                </div>
                <button
                  onClick={() => handleRemove(place.id)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setMessage("ฟังก์ชันคำนวณระยะเวลาและระยะทางยังไม่เปิดใช้งาน");
                setMessageType("info");
                setShowMessageModal(true);
              }}
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-colors mt-6"
            >
              คำนวณระยะเวลาและระยะทาง
            </button>
            <button
              onClick={() => {
                setMessage("ฟังก์ชันแจ้งเตือนกำหนดการยังไม่เปิดใช้งาน");
                setMessageType("info");
                setShowMessageModal(true);
              }}
              className="w-full px-4 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-colors mt-2"
            >
              ตั้งค่าการแจ้งเตือน
            </button>
          </div>
        )}
      </div>
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={message}
        type={messageType}
      />
    </>
  );
};

export default ItineraryPage;
