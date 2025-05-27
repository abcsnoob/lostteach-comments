import firebase from "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtcs0XkNhf7yFRTzPY-A9WYet35YjQVT8",
  authDomain: "abc-s-noob.firebaseapp.com",
  projectId: "abc-s-noob",
  storageBucket: "abc-s-noob.appspot.com",
  messagingSenderId: "196660846002",
  appId: "1:196660846002:web:ce129820f388cc838658ab",
  measurementId: "G-LG5SWH89MG"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };
