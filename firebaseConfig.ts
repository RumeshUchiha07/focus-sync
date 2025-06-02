import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyB19nKV7Snx4YV1P0Zg-wxzN-YOjkTNd7E",
  authDomain: "focussync-78cc5.firebaseapp.com",
  projectId: "focussync-78cc5",
  storageBucket: "focussync-78cc5.firebasestorage.app",
  messagingSenderId: "1096726617659",
  appId: "1:1096726617659:web:5418acc6e7af4d8e93061e",
  measurementId: "G-CJM5MLQT32"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);