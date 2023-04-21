import React, { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    // const [cancel, setIscancelled] = useState(true)


    const SignWithEmail = async (email, password) => {


        setError(null)
        setIsLoading(true)

        if (!password && !email) return
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setError(null)
            setIsLoading(false)
        } catch (error) {
            console.log(error.message)
            setIsLoading(false)
            switch (error.code) {
                case "auth/invalid-email":
                    setError("Email provided is invalid")
                    return

                case "auth/user-not-found":
                    setError("Not a registered account.")
                    return


                case "auth/wrong-password":
                    setError("user credential is wrong")
                    return

                default:
                    error.code;
            }
        } finally {
            setIsLoading(false)
        }
    }




    return { SignWithEmail, error, isLoading }
}
