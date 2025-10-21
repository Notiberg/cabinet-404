import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// Замените эти значения на ваши реальные данные из Firebase Console
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "cabinet-404.firebaseapp.com",
  databaseURL: "https://cabinet-404-default-rtdb.firebaseio.com/",
  projectId: "cabinet-404",
  storageBucket: "cabinet-404.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id-here"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
