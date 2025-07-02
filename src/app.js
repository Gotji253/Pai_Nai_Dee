// App.js (Main Application Component)
import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from './FirebaseContext';
import { doc, setDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';

// Import Components and Pages
import LoadingSpinner from './components/LoadingSpinner';
import MessageModal from './components/MessageModal';
import PlaceDetail from './components/PlaceDetail';
import AddReviewModal from './components/AddReviewModal';
import InterestsForm from './components/InterestsForm';

import HomePage from './pages/HomePage';
import ItineraryPage from './pages/ItineraryPage';
import CommunityFeedPage from './pages/CommunityFeedPage';

import { mockPlaces } from './data/mockPlaces'; // Import mock data for place details

import { Search, Calendar, Users, Heart } from 'lucide-react';

const MainApp = () => {
  const { db, userId, isAuthReady, getAppId } = useContext(FirebaseContext);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'itinerary', 'community', 'interests'
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const [favoritePlaceIds, setFavoritePlaceIds] = useState([]);
  const [itineraryPlaces, setItineraryPlaces] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const appId = getAppId();

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
      } else {
        // Create user profile if it doesn't exist
        setDoc(userDocRef, { interests: [], favorites: [], itinerary: [] }, { merge: true })
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
        return <InterestsForm onSaveInterests={handleSaveInterests} initialInterests={userInterests} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter antialiased flex flex-col">
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
        `}
      </style>

      <div className="flex-grow">
        {renderPage()}
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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <Search size={24} />
            <span className="text-xs mt-1">ค้นหา</span>
          </button>
          <button
            onClick={() => setCurrentPage('itinerary')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'itinerary' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">แผนเดินทาง</span>
          </button>
          <button
            onClick={() => setCurrentPage('community')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'community' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <Users size={24} />
            <span className="text-xs mt-1">ชุมชน</span>
          </button>
          <button
            onClick={() => setCurrentPage('interests')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${currentPage === 'interests' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <Heart size={24} />
            <span className="text-xs mt-1">ความสนใจ</span>
          </button>
          {/* Display User ID for debugging/identification */}
          <div className="absolute top-2 right-2 text-xs text-gray-400">
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
