import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4oghrqUVdALa7zpr7iWp0UjKpUuBW8uI",
  authDomain: "tickets-municipalidad-a4c32.firebaseapp.com",
  projectId: "tickets-municipalidad-a4c32",
  storageBucket: "tickets-municipalidad-a4c32.appspot.com",
  messagingSenderId: "543911718365",
  appId: "1:543911718365:web:f8f765afd5c94c286d5a34"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore y Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

