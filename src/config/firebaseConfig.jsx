import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, setDoc, serverTimestamp, doc } from "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyA0vO-Z__DbC96E4XC7sYMOObY_XMOlw9Q",
    authDomain: "coinbasepro-e4641.firebaseapp.com",
    projectId: "coinbasepro-e4641",
    storageBucket: "coinbasepro-e4641.appspot.com",
    messagingSenderId: "763888052555",
    appId: "1:763888052555:web:c4d2bb3055eae7e07b20ce"
};



export const app = initializeApp(firebaseConfig);
export const db = getFirestore()

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, updateProfile } from "firebase/auth"




export const auth = getAuth(app)


const provider = new GoogleAuthProvider()
provider.setCustomParameters({
    prompt: "select_account"
})



export const googleLogin = () => signInWithPopup(auth, provider)





export const SignnedOut = async () => await signOut(auth)







