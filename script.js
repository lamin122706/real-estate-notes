// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD0qa5FB4q7RvlcyGQ5OtCOkZNW420XwaY",
  authDomain: "ko-la-min-real-estate-no-d19cc.firebaseapp.com",
  projectId: "ko-la-min-real-estate-no-d19cc",
  storageBucket: "ko-la-min-real-estate-no-d19cc.firebasestorage.app",
  messagingSenderId: "787273676474",
  appId: "1:787273676474:web:cf84145c7ba4f812f6b483",
  measurementId: "G-CCEDRXR85S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Example: Read from Firestore
async function loadData() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

loadData();
