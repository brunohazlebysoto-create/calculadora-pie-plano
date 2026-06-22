import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Reemplaza estos valores con los de tu proyecto Firebase:
// https://console.firebase.google.com → Tu proyecto → Configuración → Apps web
const firebaseConfig = {
  apiKey: "REEMPLAZAR",
  authDomain: "REEMPLAZAR",
  projectId: "REEMPLAZAR",
  storageBucket: "REEMPLAZAR",
  messagingSenderId: "REEMPLAZAR",
  appId: "REEMPLAZAR",
};

const isConfigured = firebaseConfig.apiKey !== "REEMPLAZAR";

let db = null;
if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db, isConfigured };
