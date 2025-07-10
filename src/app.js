// App.js (Main Application Component)
import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from './FirebaseContext';
import { doc, setDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // For profile picture upload

// Import Components and Pages
import LoadingSpinner from './components/LoadingSpinner';
import MessageModal from './components/MessageModal';
import PlaceDetail from './components/PlaceDetail';
import AddReviewModal from './components/AddReviewModal';
import InterestsForm from './components/InterestsForm';

import HomePage from './pages/HomePage.tsx'; // Changed to .tsx
import ItineraryPage from './pages/ItineraryPage';
import CommunityFeedPage from './pages/CommunityFeedPage';

import { mockPlaces } from './data/mockplaces'; // Corrected path for mockPlaces

import { Search, Calendar, Users, Heart } from 'lucide-react';

const MainApp = () => {
  const { db, userId, isAuthReady, getAppId } = useContext(FirebaseContext);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'itinerary', 'community', 'interests'
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState([]);
  const [itineraryPlaces, setItineraryPlaces] = useState([]);
  const [userBio, setUserBio] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState(''); // To store the profile picture URL
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    return false;
  });

  // Notification and Location States
  const [notificationPermission, setNotificationPermission] = useState('default'); // 'default', 'granted', 'denied'
  const [currentLocation, setCurrentLocation] = useState(null); // { lat: number, lng: number }
  const [locationError, setLocationError] = useState(null); // To store geolocation errors
  const [notifiedPlaceIds, setNotifiedPlaceIds] = useState([]); // To avoid spamming notifications for same place

  const appId = getAppId();

  useEffect(() => {
    // Initialize notification permission state from browser
    setNotificationPermission(Notification.permission);
  }, []);

  // Effect to apply dark mode class to <html> and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const requestNotificationAccess = async () => {
    if (!('Notification' in window)) {
      setMessage("เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      // Optionally show a success message
      new Notification("Pai Nai Dee", { body: "เปิดใช้งานการแจ้งเตือนแล้ว!" });
    } else {
      setMessage("คุณได้ปิดการอนุญาตให้แจ้งเตือน");
      setMessageType("info");
      setShowMessageModal(true);
    }
  };

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setLocationError("เบราว์เซอร์นี้ไม่รองรับ Geolocation");
      setMessage("เบราว์เซอร์นี้ไม่รองรับ Geolocation");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null); // Clear any previous error
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(error.message);
        setMessage(`เกิดข้อผิดพลาดในการเข้าถึงตำแหน่ง: ${error.message}`);
        setMessageType("error");
        setShowMessageModal(true);
      }
    );
  };

  // Effect to watch user's position if permission granted
  useEffect(() => {
    let watchId;
    // Check for geolocation support first
    if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
    }

    // Attempt to query permission status for geolocation
    navigator.permissions?.query({ name: 'geolocation' }).then(permissionStatus => {
      if (permissionStatus.state === 'granted') {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationError(null);
          },
          (error) => {
            console.error("Error watching location:", error);
            setLocationError(error.message);
            // Avoid spamming messages for watchPosition errors
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else if (permissionStatus.state === 'prompt') {
        // User will be prompted when location is first requested (e.g. by requestLocationAccess)
        console.log("Geolocation permission prompt will be shown on first use.");
      } else if (permissionStatus.state === 'denied') {
        setLocationError("การเข้าถึงตำแหน่งถูกปฏิเสธ");
      }

      permissionStatus.onchange = () => {
        // Handle changes in permission status, e.g., re-start watch if granted
        if(permissionStatus.state === 'granted' && !watchId) {
            // Re-initialize watch if permission granted after initial denial/prompt
             watchId = navigator.geolocation.watchPosition( /* ... same as above ... */ );
        } else if (permissionStatus.state !== 'granted' && watchId) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            setCurrentLocation(null); // Clear location if permission revoked
        }
      };
    }).catch(e => {
        // Fallback for browsers that might not support navigator.permissions.query
        // In this case, rely on the prompt from getCurrentPosition/watchPosition
        console.warn("navigator.permissions.query for geolocation not supported, will rely on direct API call prompt.");
        // If we want to auto-start watching after a manual grant, we might need a different flow
        // For now, manual request via button is safer.
    });

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Run once on mount to set up permission check and potential watch

  // Helper function to calculate distance between two lat/lng points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Effect for location-based notifications
  useEffect(() => {
    if (notificationPermission === 'granted' && currentLocation && (itineraryPlaces.length > 0 || mockPlaces.length > 0)) {
      const PROXIMITY_THRESHOLD_KM = 0.5; // 500 meters

      // Check itinerary places first
      itineraryPlaces.forEach(place => {
        if (place.coordinates && !notifiedPlaceIds.includes(place.id)) {
          const distance = calculateDistance(
            currentLocation.lat, currentLocation.lng,
            place.coordinates.lat, place.coordinates.lng
          );

          if (distance <= PROXIMITY_THRESHOLD_KM) {
            new Notification("ใกล้ถึงแล้ว!", {
              body: `คุณอยู่ใกล้ ${place.name} ในแผนการเดินทางของคุณ!`,
              icon: place.image || '/logo192.png' // Use place image or a default
            });
            setNotifiedPlaceIds(prev => [...prev, place.id]);
            // Consider removing from notifiedPlaceIds after some time to allow re-notification later
          }
        }
      });

      // Optionally, check other mockPlaces for general proximity (e.g., highly rated or matching interests)
      // This could be more complex and might need filtering based on user interests if enabled.
      // For now, focusing on itinerary places.

      // Example for general places of interest (can be noisy if not filtered well)
      /*
      mockPlaces.forEach(place => {
        if (place.coordinates && !notifiedPlaceIds.includes(place.id) && !itineraryPlaces.find(p => p.id === place.id)) { // Avoid re-notifying itinerary items
          const distance = calculateDistance(
            currentLocation.lat, currentLocation.lng,
            place.coordinates.lat, place.coordinates.lng
          );

          if (distance <= PROXIMITY_THRESHOLD_KM && place.rating >= 4.7) { // Example: high rating
            new Notification("สถานที่น่าสนใจใกล้คุณ!", {
              body: `${place.name} อยู่ใกล้ๆ และมีรีวิวดีเยี่ยม!`,
              icon: place.image || '/logo192.png'
            });
            setNotifiedPlaceIds(prev => [...prev, place.id]);
          }
        }
      });
      */
    }
  }, [currentLocation, itineraryPlaces, mockPlaces, notificationPermission, notifiedPlaceIds]);


  // Provide isDarkMode to FirebaseProvider if needed for global access without prop drilling further
  // For now, direct prop passing is used.

  // Fetch user data (interests, favorites, itinerary)
  useEffect(() => {
    if (!db || !userId || !isAuthReady) return;

    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserInterests(data.interests || []);
        setFavoritePlaceIds(data.favorites || []);
        setItineraryPlaces(data.itinerary || []);
        setUserBio(data.bio || '');
        setUserPhotoURL(data.photoURL || '');
      } else {
        // Create user profile if it doesn't exist, including new fields
        setDoc(userDocRef, { interests: [], favorites: [], itinerary: [], bio: '', photoURL: '' }, { merge: true })
          .catch(error => console.error("Error creating user profile:", error));
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      setMessageType("error");
      setShowMessageModal(true);
    });

    return () => unsubscribe();
  }, [db, userId, isAuthReady, appId]);

  const handleSaveInterests = async (interests) => {
    if (!db || !userId) {
      setMessage("ไม่สามารถบันทึกความสนใจได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    try {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      await setDoc(userDocRef, { interests: interests }, { merge: true });
      setUserInterests(interests);
      setMessage("บันทึกความสนใจเรียบร้อยแล้ว!");
      setMessageType("success");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error saving interests:", error);
      setMessage("เกิดข้อผิดพลาดในการบันทึกความสนใจ");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleSaveBio = async (bioText) => {
    if (!db || !userId) {
      setMessage("ไม่สามารถบันทึก Bio ได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    try {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      await updateDoc(userDocRef, { bio: bioText });
      setUserBio(bioText);
      setMessage("บันทึก Bio เรียบร้อยแล้ว!");
      setMessageType("success");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error saving bio:", error);
      setMessage("เกิดข้อผิดพลาดในการบันทึก Bio");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleProfileImageUpload = async (file) => {
    if (!db || !userId) {
      setMessage("ไม่สามารถอัปโหลดรูปภาพได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    if (!file) return;

    const storage = getStorage();
    // Use a consistent file name like 'profile.jpg' or unique name
    const imageRef = ref(storage, `profilePictures/${appId}/${userId}/${file.name}`);

    try {
      setMessage("กำลังอัปโหลดรูปภาพ...");
      setMessageType("info");
      setShowMessageModal(true);

      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      await updateDoc(userDocRef, { photoURL: downloadURL });
      setUserPhotoURL(downloadURL);

      setMessage("อัปโหลดรูปภาพโปรไฟล์เรียบร้อยแล้ว!");
      setMessageType("success");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      setMessage("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพโปรไฟล์");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleToggleFavorite = async (placeId) => {
    if (!db || !userId) {
      setMessage("ไม่สามารถบันทึกรายการโปรดได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    try {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      const isCurrentlyFavorite = favoritePlaceIds.includes(placeId);

      if (isCurrentlyFavorite) {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(placeId)
        });
        setFavoritePlaceIds(prev => prev.filter(id => id !== placeId));
        setMessage("นำออกจากรายการโปรดแล้ว");
        setMessageType("info");
      } else {
        await updateDoc(userDocRef, {
          favorites: arrayUnion(placeId)
        });
        setFavoritePlaceIds(prev => [...prev, placeId]);
        setMessage("เพิ่มในรายการโปรดแล้ว!");
        setMessageType("success");
      }
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setMessage("เกิดข้อผิดพลาดในการบันทึกรายการโปรด");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleAddToItinerary = async (place) => {
    if (!db || !userId) {
      setMessage("ไม่สามารถเพิ่มในแผนการเดินทางได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    const isAlreadyInItinerary = itineraryPlaces.some(p => p.id === place.id);
    if (isAlreadyInItinerary) {
      setMessage("สถานที่นี้อยู่ในแผนการเดินทางของคุณแล้ว");
      setMessageType("info");
      setShowMessageModal(true);
      return;
    }
    try {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      await updateDoc(userDocRef, {
        itinerary: arrayUnion(place)
      });
      setItineraryPlaces(prev => [...prev, place]);
      setMessage("เพิ่มในแผนการเดินทางแล้ว!");
      setMessageType("success");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error adding to itinerary:", error);
      setMessage("เกิดข้อผิดพลาดในการเพิ่มในแผนการเดินทาง");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleRemoveFromItinerary = async (placeId) => {
    if (!db || !userId) {
      setMessage("ไม่สามารถนำออกจากแผนการเดินทางได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    try {
      const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile/data`);
      const updatedItinerary = itineraryPlaces.filter(p => p.id !== placeId);
      await updateDoc(userDocRef, {
        itinerary: updatedItinerary
      });
      setItineraryPlaces(updatedItinerary);
      setMessage("นำออกจากแผนการเดินทางแล้ว");
      setMessageType("info");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error removing from itinerary:", error);
      setMessage("เกิดข้อผิดพลาดในการนำออกจากแผนการเดินทาง");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  const handleAddReview = (placeId) => {
    setSelectedPlace(mockPlaces.find(p => p.id === placeId)); // Ensure selectedPlace is set for the modal
    setShowReviewModal(true);
  };

  const handleSubmitReview = (rating, reviewText) => {
    // This is a mock function for now. In a real app, you would save this to Firestore.
    console.log(`Review for ${selectedPlace.name}: Rating ${rating}, Review: ${reviewText}`);
    setMessage("รีวิวของคุณถูกส่งแล้ว (ฟังก์ชันบันทึกจริงยังไม่เปิดใช้งาน)");
    setMessageType("success");
    setShowMessageModal(true);
    setShowReviewModal(false);
  };

  const renderPage = () => {
    if (!isAuthReady) {
      return <LoadingSpinner />;
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onSelectPlace={setSelectedPlace}
            userInterests={userInterests}
            favoritePlaceIds={favoritePlaceIds}
            onToggleFavorite={handleToggleFavorite}
            onAddToItinerary={handleAddToItinerary}
          />
        );
      case 'itinerary':
        return (
          <ItineraryPage
            itineraryPlaces={itineraryPlaces}
            onRemoveFromItinerary={handleRemoveFromItinerary}
          />
        );
      case 'community':
        return <CommunityFeedPage />;
      case 'interests':
        return (
          <InterestsForm
            onSaveInterests={handleSaveInterests}
            initialInterests={userInterests}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            userBio={userBio}
            userPhotoURL={userPhotoURL}
            onSaveBio={handleSaveBio}
            onProfileImageUpload={handleProfileImageUpload}
            // Permissions props
            notificationPermission={notificationPermission}
            locationError={locationError}
            onRequestNotificationAccess={requestNotificationAccess}
            onRequestLocationAccess={requestLocationAccess}
          />
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-inter antialiased flex flex-col transition-colors duration-300">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter Font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          @keyframes scale-in {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
          }
          @keyframes scale-out {
            from {
              transform: scale(1);
              opacity: 1;
            }
            to {
              transform: scale(0.95);
              opacity: 0;
            }
          }
          .animate-scale-out {
            animation: scale-out 0.2s ease-in forwards;
          }
          @keyframes fade-in-slide-up {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-slide-up {
            animation: fade-in-slide-up 0.3s ease-out forwards;
          }
        `}
      </style>

      <div className="flex-grow">
        {/* Wrapper for page transition animation */}
        <div key={currentPage} className="animate-fade-in-slide-up">
          {renderPage()}
        </div>
      </div>

      {selectedPlace && (
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onAddReview={handleAddReview}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favoritePlaceIds.includes(selectedPlace.id)}
          onAddToItinerary={handleAddToItinerary}
        />
      )}

      {showReviewModal && selectedPlace && (
        <AddReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message={message}
        type={messageType}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg z-40 transition-colors duration-300">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'home' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
          >
            <Search size={24} />
            <span className="text-xs mt-1">ค้นหา</span>
          </button>
          <button
            onClick={() => setCurrentPage('itinerary')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'itinerary' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">แผนเดินทาง</span>
          </button>
          <button
            onClick={() => setCurrentPage('community')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'community' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
          >
            <Users size={24} />
            <span className="text-xs mt-1">ชุมชน</span>
          </button>
          <button
            onClick={() => setCurrentPage('interests')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'interests' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
          >
            <Heart size={24} />
            <span className="text-xs mt-1">ความสนใจ</span>
          </button>
          {/* Display User ID for debugging/identification */}
          <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-slate-500">
            ID: {userId ? userId.substring(0, 8) + '...' : 'N/A'}
          </div>
        </div>
      </nav>
    </div>
  );
};

// This is the main entry point for the React App in Canvas
export default function AppWrapper() {
  return (
    <FirebaseProvider>
      <MainApp />
    </FirebaseProvider>
  );
}
