// FirebaseContext.js
import React, { useState, useEffect, createContext, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// สร้าง Context สำหรับ Firebase
export const FirebaseContext = createContext(null);

// Provider Component สำหรับ Firebase
export const FirebaseProvider = ({ children }) => {
  const [app, setApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null); // New state for Firebase errors

  // Helper function to initialize Firebase app and services
  const initFirebase = async () => {
    // Check for Firebase config global variable
    if (typeof __firebase_config === 'undefined' || !__firebase_config) {
      const errMsg = "Firebase config (__firebase_config) is missing or empty.";
      console.error(errMsg);
      setFirebaseError(new Error(errMsg + " App functionality will be limited."));
      // Return null or throw to indicate failure to the caller if preferred
      // For now, we allow it to proceed, potentially failing at initializeApp
    }

    const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
      ? JSON.parse(__firebase_config)
      : {};

    let currentApp;
    if (!getApps().length) {
      // Initialize Firebase if no apps are present
      currentApp = initializeApp(firebaseConfig);
    } else {
      // Use the already initialized app
      currentApp = getApps()[0];
    }

    const currentDb = getFirestore(currentApp);
    const currentAuth = getAuth(currentApp);

    setApp(currentApp);
    setDb(currentDb);
    setAuth(currentAuth);

    return { currentAuth }; // Return auth instance for the auth handler
  };

  // Helper function to handle authentication state and sign-in logic
  const setupAuthListener = (firebaseAuth) => {
    if (!firebaseAuth) return () => {}; // No auth instance, return no-op unsubscribe

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is signed in
        setUserId(user.uid);
        setIsAuthReady(true);
      } else {
        // User is signed out or not yet signed in
        try {
          // Check for initial auth token global variable
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            // Attempt to sign in with custom token
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } else {
            // Fallback to anonymous sign-in if no token
            // console.warn("Initial auth token (__initial_auth_token) is missing. Attempting anonymous sign-in.");
            await signInAnonymously(firebaseAuth);
          }
        } catch (authError) {
          console.error("Error during authentication:", authError);
          setFirebaseError(authError); // Set Firebase error state for consumer components
        } finally {
          // Mark auth as ready regardless of sign-in success or failure,
          // allowing the app to proceed and potentially display an error.
          setIsAuthReady(true);
        }
      }
    });
    return unsubscribe; // Return the unsubscribe function for cleanup
  };

  useEffect(() => {
    let unsubscribe = () => {}; // Initialize unsubscribe to a no-op function

    const initializeAndAuth = async () => {
      try {
        const { currentAuth } = await initFirebase();
        if (currentAuth) {
          unsubscribe = setupAuthListener(currentAuth);
        } else {
          // If initFirebase indicates a critical failure (e.g., by not returning currentAuth)
          // and hasn't set firebaseError itself, set it here.
          // Or, rely on initFirebase to set the error.
          // For now, if currentAuth is null, setupAuthListener handles it.
          // We also need to ensure isAuthReady is set.
          setIsAuthReady(true); // If Firebase init fails to return auth, auth can't proceed.
        }
      } catch (initError) {
        console.error("Failed to initialize Firebase:", initError);
        setFirebaseError(initError); // Set Firebase error state
        setIsAuthReady(true); // Mark auth as "ready" to unblock UI, error will be available
      }
    };

    initializeAndAuth();

    // Cleanup function for useEffect
    return () => {
      unsubscribe(); // Call the stored unsubscribe function
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Utility function to get app ID
  const getAppId = () => {
    if (typeof __app_id !== 'undefined' && __app_id) {
      return __app_id;
    }
    console.warn("__app_id is not defined. Using 'default-app-id'.");
    // setFirebaseError(new Error("__app_id is not defined.")); // Decide if this is a critical error
    return 'default-app-id'; // Fallback App ID
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    app,
    db,
    auth,
    userId,
    isAuthReady,
    firebaseError,
    getAppId, // getAppId is stable as it's defined in the provider's scope
  }), [app, db, auth, userId, isAuthReady, firebaseError]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};

/*
// --------------- Example Usage ---------------
// Save this as a separate component file, e.g., UserProfile.js
// import React, { useContext } from 'react';
// import { FirebaseContext } from './FirebaseContext'; // Adjust path as needed

const UserProfile = () => {
  const { auth, userId, isAuthReady, firebaseError, getAppId } = useContext(FirebaseContext);

  if (firebaseError) {
    return (
      <div>
        <h2>Error Initializing Firebase or Authenticating</h2>
        <p>Details: {firebaseError.message}</p>
        <p>App ID (if available): {typeof __app_id !== 'undefined' ? __app_id : 'N/A (Error before App ID check or __app_id not set)'}</p>
        <p>Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  if (!isAuthReady) {
    return <p>Loading user authentication status...</p>;
  }

  const handleSignOut = async () => {
    if (auth) {
      try {
        await auth.signOut();
        // User will be signed out, onAuthStateChanged will trigger a re-render
        // and likely lead to anonymous sign-in again based on current context logic
        console.log("User signed out. Anonymous sign-in might occur next.");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  const currentAppId = getAppId(); // Example of using getAppId

  return (
    <div>
      <h2>User Profile</h2>
      <p>App ID: {currentAppId}</p>
      {userId ? (
        <>
          <p>User ID: {userId}</p>
          <p>Authentication is ready.</p>
          {auth && auth.currentUser && auth.currentUser.isAnonymous && (
            <p><em>You are currently signed in anonymously.</em></p>
          )}
          <button onClick={handleSignOut} disabled={!auth}>Sign Out</button>
        </>
      ) : (
        <p>No user is currently signed in. You might be in the process of anonymous sign-in or an error occurred.</p>
      )}
    </div>
  );
};

// To use FirebaseProvider and UserProfile in your app:
// App.js
// import React from 'react';
// import { FirebaseProvider } from './FirebaseContext'; // Adjust path
// import UserProfile from './UserProfile'; // Adjust path

// function App() {
//   return (
//     <FirebaseProvider>
//       <div className="App">
//         <header className="App-header">
//           <h1>My Firebase App</h1>
//         </header>
//         <UserProfile />
//       </div>
//     </FirebaseProvider>
//   );
// }
// export default App;

*/
