// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/app';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4xs7EPlXgR8_xZCG2jhypYIkICin_1QY",
  authDomain: "blog-33a17.firebaseapp.com",
  databaseURL: "https://blog-33a17-default-rtdb.firebaseio.com",
  projectId: "blog-33a17",
  storageBucket: "blog-33a17.appspot.com",
  messagingSenderId: "4714567003",
  appId: "1:4714567003:web:dba3b428a950b8100b767e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage