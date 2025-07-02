// components/InterestsForm.js
import React, { useState } from 'react';
import MessageModal from './MessageModal';

const InterestsForm = ({ onSaveInterests, initialInterests = [] }) => {
  const [selectedInterests, setSelectedInterests] = useState(initialInterests);
  const interestsOptions = [
    'ผจญภัย', 'วัฒนธรรม', 'พักผ่อน', 'ธรรมชาติ', 'ช้อปปิ้ง', 'อาหาร', 'ประวัติศาสตร์', 'ศิลปะ', 'ถ่ายภาพ', 'กิจกรรมทางน้ำ'
  ];
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    if (selectedInterests.length === 0) {
      setMessage("กรุณาเลือกความสนใจอย่างน้อยหนึ่งอย่าง");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    onSaveInterests(selectedInterests);
    // Message will be shown by parent component after submission
  };

  return (
    <>
      <div className="p-6 bg-white rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">คุณสนใจอะไร?</h2>
        <p className="text-gray-600 mb-6">เลือกความสนใจของคุณเพื่อรับคำแนะนำที่ตรงใจ</p>
        <div className="flex flex-wrap gap-3">
          {interestsOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full border-2 transition-colors duration-200
                ${selectedInterests.includes(interest)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-200'
                }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-8 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-colors"
        >
          บันทึกความสนใจ
        </button>
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

export default InterestsForm;
