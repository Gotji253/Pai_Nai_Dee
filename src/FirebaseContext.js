// FirebaseContext.js
import React, { useState, useEffect, createContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// สร้าง Context สำหรับ Firebase
export const FirebaseContext = createContext(null);

// Utility function to get app ID
const getAppId = () => typeof __app_id !== 'undefined' ? __app_id : 'default-wanderlust-app';

// Provider Component สำหรับ Firebase
export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      // ตรวจสอบและใช้ __firebase_config ที่มีอยู่
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const initializedApp = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(initializedApp);
      const firebaseAuth = getAuth(initializedApp);

      setApp(initializedApp);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // ตั้งค่า Listener สำหรับสถานะการยืนยันตัวตน
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // หากไม่มีโทเค็นเริ่มต้นหรือผู้ใช้ออกจากระบบ ให้เข้าสู่ระบบแบบไม่ระบุตัวตน
          try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              await signInWithCustomToken(firebaseAuth, __initial_auth_token);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Error signing in:", error);
          }
        }
        setIsAuthReady(true); // ตั้งค่าเป็น true เมื่อสถานะการยืนยันตัวตนพร้อม
      });

      return () => unsubscribe(); // ยกเลิกการสมัครสมาชิกเมื่อคอมโพเนนต์ถูกยกเลิกการเชื่อมต่อ
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }, []); // รันเพียงครั้งเดียวเมื่อคอมโพเนนต์เมาท์

  return (
    <FirebaseContext.Provider value={{ app, db, auth, userId, isAuthReady, getAppId }}>
      {children}
    </FirebaseContext.Provider>
  );
};
