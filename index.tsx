import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyBo41yfxA-XuM4nF4ISYW2_B5qTSW45AtY",
  authDomain: "vending-31018.firebaseapp.com",
  databaseURL: "https://vending-31018-default-rtdb.firebaseio.com",
  projectId: "vending-31018",
  storageBucket: "vending-31018.firebasestorage.app",
  messagingSenderId: "538188463039",
  appId: "1:538188463039:web:d6936de3ef361a3f1f3f0a"
};

// Initialize Firebase
// @ts-ignore global firebase
const app = firebase.initializeApp(firebaseConfig);
// @ts-ignore global firebase
export const db = firebase.database();


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);