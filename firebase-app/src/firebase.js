import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAqReUWxUzwDu0jjv0IoCL2kYs_H3EPIUk",
  authDomain: "mcnally-shop.firebaseapp.com",
  projectId: "mcnally-shop",
  storageBucket: "mcnally-shop.appspot.com",
  messagingSenderId: "596579024505",
  appId: "1:596579024505:web:43c68a9164101affe89ea8"
};

const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);

if(!isProduction) connectFunctionsEmulator(functions, 'localhost', 5021);