import { getFirestore } from '@firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyBOUI4Nbjyrar2z6Jdjp1M7ziRuDBnbQjo",
  authDomain: "my-file-clone.firebaseapp.com",
  projectId: "my-file-clone",
  storageBucket: "my-file-clone.appspot.com",
  messagingSenderId: "873320515679",
  appId: "1:873320515679:web:a22244ae8a46cc9922b3ea"
}


const app = initializeApp(firebaseConfig)

const googleProvider = new GoogleAuthProvider()

const auth = getAuth()
const db = getFirestore()
const storage = getStorage()

export { app, auth, db, storage, googleProvider }
