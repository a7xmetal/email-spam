import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyAV0Qj6HYR1ObmnZoYJBrtiVhiu_uV1pug",
   authDomain: "clone-ec6f9.firebaseapp.com",
   projectId: "clone-ec6f9",
   storageBucket: "clone-ec6f9.appspot.com",
   messagingSenderId: "495170730428",
   appId: "1:495170730428:web:a0550eab1dfe25b13393b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
