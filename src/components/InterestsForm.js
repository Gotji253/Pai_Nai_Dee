// components/InterestsForm.js
import React, { useState, useEffect } from 'react';
// import MessageModal from './MessageModal'; // Replaced by inline error messages
import { Moon, Sun, UserCircle, Edit3 } from 'lucide-react';

const InterestsForm = ({
  onSaveInterests,
  initialInterests = [],
  isDarkMode,
  setIsDarkMode,
  userBio = '',
  userPhotoURL = '',
  onSaveBio,
  onProfileImageUpload,
  notificationPermission,
  locationError,
  onRequestNotificationAccess,
  onRequestLocationAccess
}) => {
  const [selectedInterests, setSelectedInterests] = useState(initialInterests);
  const [bioText, setBioText] = useState(userBio);
  const [interestsError, setInterestsError] = useState('');

  const interestsOptions = [
    'ผจญภัย', 'วัฒนธรรม', 'พักผ่อน', 'ธรรมชาติ', 'ช้อปปิ้ง', 'อาหาร', 'ประวัติศาสตร์', 'ศิลปะ', 'ถ่ายภาพ', 'กิจกรรมทางน้ำ'
  ];

  // Unique IDs for ARIA attributes
  const profileSectionId = "profile-section-heading";
  const interestsSectionId = "interests-section-heading";
  const interestsGroupId = "interests-group";
  const interestsErrorId = "interests-error";
  const permissionsSectionId = "permissions-section-heading";
  const notificationErrorId = "notification-error";
  const locationErrorId = "location-error";


  useEffect(() => {
    setBioText(userBio);
  }, [userBio]);

  useEffect(() => {
    if (selectedInterests.length > 0) {
      setInterestsError('');
    }
  }, [selectedInterests]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onProfileImageUpload(file);
    }
  };

  const handleSaveBioClick = () => {
    // Add validation for bio if needed
    onSaveBio(bioText);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmitInterests = (e) => {
    e.preventDefault(); // Prevent default form submission if this were a form
    if (selectedInterests.length === 0) {
      setInterestsError("กรุณาเลือกความสนใจอย่างน้อยหนึ่งอย่าง");
      return;
    }
    setInterestsError('');
    onSaveInterests(selectedInterests);
  };

  const handleProfileImageKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      document.getElementById('profileImageUpload').click();
    }
  };

  return (
    // The main container could be a <form> if all actions within are related to one submission.
    // For now, keeping it as sections with individual action buttons.
    <>
      <section aria-labelledby={profileSectionId} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md mb-6 transition-colors duration-300">
        <div className="mb-8 p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
          <h3 id={profileSectionId} className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-4">โปรไฟล์ของคุณ</h3>
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
            <div className="relative group">
              {userPhotoURL ? (
                <img src={userPhotoURL} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
              ) : (
                <UserCircle size={128} className="text-slate-300 dark:text-slate-600 w-32 h-32" />
              )}
              <label
                htmlFor="profileImageUpload"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full cursor-pointer transition-opacity"
                tabIndex={0} // Make label focusable
                onKeyDown={handleProfileImageKeyDown} // Allow activation with Enter/Space
                aria-label="Change profile picture"
              >
                <Edit3 size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </label>
              <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageInputChange} />
            </div>
            <div className="flex-grow w-full">
              <label htmlFor="bioText" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                เกี่ยวกับคุณ (Bio):
              </label>
              <textarea
                id="bioText"
                rows="4"
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 transition-colors duration-300"
                placeholder="บอกเล่าเรื่องราวของคุณสั้นๆ..."
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                aria-label="Your biography"
              ></textarea>
              <button
                type="button"
                onClick={handleSaveBioClick}
                className="mt-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                บันทึก Bio
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby={interestsSectionId} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md mb-6 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h2 id={interestsSectionId} className="text-2xl font-bold text-gray-800 dark:text-slate-100">คุณสนใจอะไร?</h2>
          <button
            type="button"
            onClick={handleToggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-slate-600" />}
          </button>
        </div>

        <p id={`${interestsGroupId}-description`} className="text-gray-600 dark:text-slate-300 mb-6">เลือกความสนใจของคุณเพื่อรับคำแนะนำที่ตรงใจ</p>
        <div
            role="group"
            aria-labelledby={interestsGroupId}
            aria-describedby={interestsError ? interestsErrorId : `${interestsGroupId}-description`}
            className="flex flex-wrap gap-3"
        >
          <span id={interestsGroupId} className="sr-only">Interests selection</span> {/* Hidden label for the group */}
          {interestsOptions.map((interest) => (
            <button
              type="button"
              key={interest}
              onClick={() => toggleInterest(interest)}
              aria-pressed={selectedInterests.includes(interest)}
              className={`px-4 py-2 rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${selectedInterests.includes(interest)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600 dark:hover:border-slate-500'
                }`}
            >
              {interest}
            </button>
          ))}
        </div>
        {interestsError && <p id={interestsErrorId} className="text-red-500 text-xs mt-2" aria-live="polite">{interestsError}</p>}
        <button
          type="button"
          onClick={handleSubmitInterests}
          className="mt-8 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
          aria-describedby={interestsError ? interestsErrorId : undefined}
        >
          บันทึกความสนใจ
        </button>
      </section>

      <section aria-labelledby={permissionsSectionId} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md mt-6 transition-colors duration-300">
        <h3 id={permissionsSectionId} className="text-xl font-semibold text-gray-800 dark:text-slate-100 mb-4">การอนุญาต</h3>
        <div className="space-y-4">
          <div>
            <button
              type="button"
              onClick={onRequestNotificationAccess}
              disabled={notificationPermission === 'granted'}
              className="w-full px-4 py-2 bg-sky-600 dark:bg-sky-500 text-white font-medium rounded-md shadow-sm hover:bg-sky-700 dark:hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-describedby={notificationPermission === 'denied' ? notificationErrorId : undefined}
            >
              {notificationPermission === 'granted' ? 'เปิดใช้งานการแจ้งเตือนแล้ว' : 'ขออนุญาตส่งการแจ้งเตือน'}
            </button>
            {notificationPermission === 'denied' &&
              <p id={notificationErrorId} className="text-xs text-red-500 dark:text-red-400 mt-1" aria-live="polite">
                คุณได้ปิดกั้นการแจ้งเตือน
              </p>
            }
          </div>
          <div>
            <button
              type="button"
              onClick={onRequestLocationAccess}
              className="w-full px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              aria-describedby={locationError ? locationErrorId : undefined}
            >
              ขออนุญาตเข้าถึงตำแหน่ง
            </button>
            {locationError &&
              <p id={locationErrorId} className="text-xs text-red-500 dark:text-red-400 mt-1" aria-live="polite">
                ข้อผิดพลาดตำแหน่ง: {locationError}
              </p>
            }
          </div>
        </div>
      </section>

      {/*
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={message}
        type={messageType}
      />
      */}
    </>
  );
};

export default InterestsForm;
