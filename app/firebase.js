// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZFHdU8X2JB3nuuDzUZScVpGOnQsjCYHg",
  authDomain: "headstarter-pantry-track-dffa0.firebaseapp.com",
  projectId: "headstarter-pantry-track-dffa0",
  storageBucket: "headstarter-pantry-track-dffa0.appspot.com",
  messagingSenderId: "407644797073",
  appId: "1:407644797073:web:155a8db2d2ab78ad872730"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);