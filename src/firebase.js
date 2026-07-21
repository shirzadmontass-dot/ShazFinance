import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCwqX0cQm0tVv0tYp8p0Z8u8Yp8u8Yp8u8",
  authDomain: "shazplan.firebaseapp.com",
  databaseURL: "https://shazplan-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shazplan",
  storageBucket: "shazplan.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:abc123xyz456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime Database
const db = getDatabase(app);

// ⭐ EXACT exports your store.js requires
export const dbRef = (path) => ref(db, path);
export { onValue, set };