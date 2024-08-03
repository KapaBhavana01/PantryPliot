// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8WUwcCaev_ZpXuAVyLTdusoMlyCoe8FE",
  authDomain: "pantry-tracker-bc57e.firebaseapp.com",
  projectId: "pantry-tracker-bc57e",
  storageBucket: "pantry-tracker-bc57e.appspot.com",
  messagingSenderId: "593833644023",
  appId: "1:593833644023:web:8ec1ae8d994c6a1f23e8f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };