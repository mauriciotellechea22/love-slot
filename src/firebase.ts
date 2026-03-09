import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDDok01g6xrIyjHJavNCZSPTjnhlJ7muj0",
    authDomain: "love-slot-c5597.firebaseapp.com",
    projectId: "love-slot-c5597",
    storageBucket: "love-slot-c5597.firebasestorage.app",
    messagingSenderId: "362206977068",
    appId: "1:362206977068:web:df86c87738804543f84589",
    measurementId: "G-MEJRMC2DBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
