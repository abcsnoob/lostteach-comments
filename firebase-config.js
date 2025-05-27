// cấu hình firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtcs0XkNhf7yFRTzPY-A9WYet35YjQVT8",
  authDomain: "abc-s-noob.firebaseapp.com",
  databaseURL: "https://abc-s-noob-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "abc-s-noob",
  storageBucket: "abc-s-noob.firebasestorage.app",
  messagingSenderId: "196660846002",
  appId: "1:196660846002:web:ce129820f388cc838658ab",
  measurementId: "G-LG5SWH89MG"
};

// khởi tạo app
firebase.initializeApp(firebaseConfig);

// khai báo global cho tiện xài trong script.js
const auth = firebase.auth();
const db = firebase.firestore();
