// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlrFZ7E7hU-3DPd8ykdDsaCoVu4Q9Ga3Y",
  authDomain: "taller-proyecto-6190e.firebaseapp.com",
  projectId: "taller-proyecto-6190e",
  storageBucket: "taller-proyecto-6190e.appspot.com",
  messagingSenderId: "677848867911",
  appId: "1:677848867911:web:e56ce0c6cc12fdaef9bd62"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)