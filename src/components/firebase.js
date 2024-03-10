// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_cEOjYGSmqnjucXbRmzpsSoDbMQwK2d0",
  authDomain: "wastemanagement-8f65c.firebaseapp.com",
  databaseURL: "https://wastemanagement-8f65c-default-rtdb.firebaseio.com",
  projectId: "wastemanagement-8f65c",
  storageBucket: "wastemanagement-8f65c.appspot.com",
  messagingSenderId: "150087705974",
  appId: "1:150087705974:web:154ded279664a76670c657",
  measurementId: "G-DXMKWY2LN3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = firebase.database();
