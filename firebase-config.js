"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyBh69I9WATUhZ1pdbjZo58ELONSWNRQzBg",
  authDomain: "dct-dart.firebaseapp.com",
  projectId: "dct-dart",
  storageBucket: "dct-dart.firebasestorage.app",
  messagingSenderId: "291022570503",
  appId: "1:291022570503:web:632ad275b92bcb04cc56a2",
  measurementId: "G-0ENPQD91XD"
};

// Firebase initialiseren
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);