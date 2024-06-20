import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAtvkA0mJC3oCPPqvi8-7vbE9EZTNryE0Y",
    authDomain: "pi-prog-iii.firebaseapp.com",
    projectId: "pi-prog-iii",
    storageBucket: "pi-prog-iii.appspot.com",
    messagingSenderId: "605437785724",
    appId: "1:605437785724:web:e225daf8f040664267bbf9"
  };
  app.initializeApp(firebaseConfig);

  export const auth = firebase.auth()
  export const db = app.firestore()
  export const storage = app.storage()
