import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export async function pruebaConexionFirestore() {
  try {
    const docRef = await addDoc(collection(db, "testConexion"), {
      mensaje: "¡Firebase funciona!",
      timestamp: new Date()
    });
    console.log("✅ Documento creado con ID:", docRef.id);
  } catch (e) {
    console.error("❌ Error al escribir en Firestore:", e);
  }
}
