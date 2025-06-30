// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyB4oghrqUVdALa7zpr7iWp0UjKpUuBW8uI",
  authDomain: "tickets-municipalidad-a4c32.firebaseapp.com",
  projectId: "tickets-municipalidad-a4c32",
  storageBucket: "tickets-municipalidad-a4c32.appspot.com",
  messagingSenderId: "543911718365",
  appId: "1:543911718365:web:f8f765afd5c94c286d5a34"
};

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
