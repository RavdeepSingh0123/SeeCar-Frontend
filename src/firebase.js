// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Kd3Wuk_eDn670--dZjlacbYGKqRbfFo",
  authDomain: "seecar-7becd.firebaseapp.com",
  projectId: "seecar-7becd",
  storageBucket: "seecar-7becd.firebasestorage.app",
  messagingSenderId: "913827797775",
  appId: "1:913827797775:web:eb66c9bb0fe6bc90797c7a",
  measurementId: "G-2NNXC2VP1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app