import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAngUcW85KHOXfGfvcjmxcle5Erbyp8GV4", 
  authDomain: "memorial-33b56.firebaseapp.com",
  projectId: "memorial-33b56",
  storageBucket: "memorial-33b56.firebasestorage.app",
  messagingSenderId: "250711661065",
  appId: "1:250711661065:web:9025d1832bf1a033c0b6d8"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);