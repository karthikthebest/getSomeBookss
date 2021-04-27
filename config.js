import * as firebase from 'firebase'
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyBfoBZAVx3gzTpOqRnkVcaBxpSaBUgPY9Y",
  authDomain: "getsomebooks-ca8e0.firebaseapp.com",
  projectId: "getsomebooks-ca8e0",
  storageBucket: "getsomebooks-ca8e0.appspot.com",
  messagingSenderId: "29726872932",
  appId: "1:29726872932:web:d6bca5d1a4dd1d723dd671"
};

  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();