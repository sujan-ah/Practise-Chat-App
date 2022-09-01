import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,updateProfile , } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOyuR8Il-XN-hfTq9iGrsTdh4WcgbdXJ0",
  authDomain: "practise-57355.firebaseapp.com",
  projectId: "practise-57355",
  storageBucket: "practise-57355.appspot.com",
  messagingSenderId: "1040891467701",
  appId: "1:1040891467701:web:e02d6515e85f7bf07cabfc"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {getAuth,createUserWithEmailAndPassword, updateProfile, getDatabase, ref, set, storage  }