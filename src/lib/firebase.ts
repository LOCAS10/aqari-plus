import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOtEEbMaRWo1IDaxcwYJBNC_KabVqt7xc",
  authDomain: "aqari-plus-db.firebaseapp.com",
  projectId: "aqari-plus-db",
  storageBucket: "aqari-plus-db.firebasestorage.app",
  messagingSenderId: "33042787554",
  appId: "1:33042787554:web:17dee5ff7a32cc427bc2bb"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export default app;
