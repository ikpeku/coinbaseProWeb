import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '../config/firebaseConfig'
import { setDoc, serverTimestamp, doc } from 'firebase/firestore'

export const useRegister = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    const CreateWithEmail = async (email, password, fullName, date) => {

        // console.log("enter", email, password, fullName, date)
        setError(null)
        setIsLoading(true)
        if (!password && !email && !fullName && !date) return

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)
            // await sendEmailVerification(auth.currentUser)
            await updateProfile(auth.currentUser, { displayName: fullName })



            const data = {
                Register: serverTimestamp(),
                Name: fullName,
                Email: email,
                DOB: date,
                phoneNumber: "",
                licence: "",
                licenceBack: "",
                passport: "",
                verifyUser: false,
                bankName: "",
                accountNumber: "",
                accountName: "",
                swiftCode: "",
                token: {
                    BTC: 0, ETH: 0, USDT: 0, LTC: 0, BNB: 0
                },
                selectedCoin: {
                    name: "BTC",
                    amount: 0,
                    title: 'Bitcoin',
                    address: "1GKpL6QtazVRdBTPeqeFqpZYif6a6Jfsku"
                },
                Deposit: {
                    amount: "",
                    status: false,
                    type: ""
                },
                Withdraw: {
                    amount: "",
                    status: false,
                    type: ""
                },
                transactions: []
            }

            console.log(data)


            await setDoc(doc(db, "users", user.uid), data)

            console.log("done")

        } catch (error) {
            console.log(error.message)

            switch (error.code) {
                case "auth/invalid-email":
                    setError("Email provided is invalid")
                    return
                case "auth/weak-password":
                    setError("password should be less than 6 characters")
                    return
                case "auth/email-already-in-use":
                case "auth/email-already-exists":
                    setError("The provided email is already in use by an existing user. ")
                    return
                case "auth/internal-error":
                    setError("ooooh! operation fail")
                    return
                case "auth/invalid-display-name":
                    setError("The provided value for the displayName is invalid. It must not be empty.")
                    return

                case "auth/invalid-email":
                    setError("The provided value for the email is invalid. ")
                    return
                case "auth/network-request-failed":
                    setError("Bad Network", "weak network please refresh.")
                    return
                case "auth/missing-email":
                    setError("Email missing", "Please provide a valid email to continue.")
                    return

                default:
                    break;
            }

        } finally {
            setIsLoading(false)
        }

    }


    // const SignWithEmail = async (email, password) => {
    //     if (!cancel) {
    //         if (cancel) return

    //         setError(null)
    //         setIsLoading(true)

    //         if (!password && !email) return
    //         try {
    //             await signInWithEmailAndPassword(auth, email, password)
    //             setError(null)

    //         } catch (error) {
    //             console.log(error.message)

    //             switch (error.code) {
    //                 case "auth/invalid-email":
    //                     setError("Email provided is invalid")
    //                     return

    //                 case "auth/user-not-found":
    //                     setError("Not a registered account.")
    //                     return


    //                 case "auth/wrong-password":
    //                     setError("user credential is wrong")
    //                     return

    //                 default:
    //                     error.code;
    //             }
    //         } finally {
    //             setIsLoading(false)
    //         }
    //     }
    // }



    return { CreateWithEmail, error, isLoading }
}



