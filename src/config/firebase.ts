import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPRJ-JGwrWEwWmeM3CVThhnPqw0ZoPCXU",
  authDomain: "academy-portal-af625.firebaseapp.com",
  projectId: "academy-portal-af625",
  storageBucket: "academy-portal-af625.appspot.com",
  messagingSenderId: "109023055577089212898",
  appId: "1:109023055577089212898:web:demo"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
