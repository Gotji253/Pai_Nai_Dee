// pages/CommunityFeedPage.js
import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../FirebaseContext';
import MessageModal from '../components/MessageModal';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { Users } from 'lucide-react';

const CommunityFeedPage = () => {
  const { db, userId, isAuthReady, getAppId } = useContext(FirebaseContext);
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (!db || !isAuthReady) return;

    const appId = getAppId();
    const postsRef = collection(db, `artifacts/${appId}/public/data/communityPosts`);
    const unsubscribe = onSnapshot(postsRef, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString('th-TH') || 'ไม่ระบุเวลา' // Convert Firestore Timestamp to readable date
      }));
      setPosts(fetchedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))); // Sort by newest
    }, (error) => {
      console.error("Error fetching community posts:", error);
      setMessage("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์");
      setMessageType("error");
      setShowMessageModal(true);
    });

    return () => unsubscribe();
  }, [db, isAuthReady, getAppId]);

  const handlePost = async () => {
    if (!newPostText.trim()) {
      setMessage("กรุณาพิมพ์ข้อความก่อนโพสต์");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }
    if (!db || !userId) {
      setMessage("ไม่สามารถโพสต์ได้: ผู้ใช้ไม่ได้เข้าสู่ระบบ");
      setMessageType("error");
      setShowMessageModal(true);
      return;
    }

    try {
      const appId = getAppId();
      await addDoc(collection(db, `artifacts/${appId}/public/data/communityPosts`), {
        userId: userId,
        userName: `ผู้ใช้ ${userId.substring(0, 8)}...`, // Mock user name
        text: newPostText,
        timestamp: new Date(),
      });
      setNewPostText('');
      setMessage("โพสต์ของคุณถูกส่งแล้ว!");
      setMessageType("success");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error adding post:", error);
      setMessage("เกิดข้อผิดพลาดในการโพสต์");
      setMessageType("error");
      setShowMessageModal(true);
    }
  };

  return (
    <>
      <div className="p-4 pb-20 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Community Feed</h1>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="คุณมีอะไรจะแบ่งปัน?..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          ></textarea>
          <button
            onClick={handlePost}
            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            โพสต์
          </button>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Users size={64} className="text-gray-400 mx-auto mb-4" />
              ยังไม่มีโพสต์ในชุมชน
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-600 font-semibold">
                    {post.userName ? post.userName[0] : 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.userName}</p>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{post.text}</p>
              </div>
            ))
          )}
        </div>
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

export default CommunityFeedPage;
