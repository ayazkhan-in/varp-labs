import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD5Sc4I5ygGm3cO8OB6tKwL28a1QrXPRts',
  authDomain: 'varp-labs.firebaseapp.com',
  projectId: 'varp-labs',
  storageBucket: 'varp-labs.firebasestorage.app',
  messagingSenderId: '108258403710',
  appId: '1:108258403710:web:021b426400aa74a3e07f2f',
  measurementId: 'G-6Y0G77Q66R',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
