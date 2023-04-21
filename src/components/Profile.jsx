
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Inputelement } from '../components/Inputelement'
import { DatePicker } from 'antd'
import dayjs from 'dayjs';
import Dropable from './Dropable'

//
import { db, auth } from '../config/firebaseConfig'
import { sendEmailVerification, updateEmail, updatePhoneNumber, updateProfile } from 'firebase/auth'
import { updateDoc, doc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import UseImage from './UseImage'


// import { uuid } from 'uuidv4';

// import { SignnedOut } from '../firebase/firebaseConfig'

// import { AuthContext } from '../context/AuthContext'



export const Profile = () => {
    const [dob, setDOB] = useState()
    const dateFormat = 'YYYY/MM/DD';
    const onChange = (date, dateString) => {        // console.log(dateString);
        setDOB(date)
    };

    const [edit, setEdit] = useState(true)


    // textinput state
    const [Name, setFullName] = useState("")
    const [Email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const [bankName, setbankName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [accountName, setAccountName] = useState("")
    const [swiftCode, setSwiftCode] = useState("")

    const [licenceUrl, setLicenceUrl] = useState("")
    const [passporteUrl, setPassporteUrl] = useState("")
    const [licenceBackUrl, setLicenceBackUrl] = useState("")


    // Handle form edit
    const { handleSubmit, control } = useForm({
        values: {
            Full_Name: Name,
            Email: Email,
            Phone_number: phoneNumber,
            Bank_Name: bankName,
            Account_Name: accountName,
            Account_Number: accountNumber,
            Swift_Code: swiftCode,
        },
        defaultValues: {
            Full_Name: "",
            Email: "",
            Phone_number: "",
            Bank_Name: "",
            Account_Name: "",
            Account_Number: "",
            Swift_Code: "",
        }
    })



    useEffect(() => {

        const refDoc = doc(db, "users", auth.currentUser.uid)

        const unsub = onSnapshot(refDoc, (snapshot) => {
            if (snapshot.exists()) {
                const { Name, Email, DOB, phoneNumber, bankName, accountNumber, accountName, swiftCode, passport, licence, licenceBack } = snapshot?.data()
                setFullName(Name)
                setEmail(Email)
                setDOB(DOB.toDate().toLocaleDateString())
                setPhoneNumber(phoneNumber)
                setbankName(bankName)
                setAccountNumber(accountNumber)
                setAccountName(accountName)
                setSwiftCode(swiftCode)
                setPassporteUrl(passport)
                setLicenceUrl(licence)
                setLicenceBackUrl(licenceBack)

            }
        })

        return () => unsub()
    }, [])



    const [passport, setPassport] = useState()
    const [licence, setLicence] = useState()
    const [licenceBack, setLicenceBack] = useState()


    // upload image to cloud 

    const handleImagesSubmit = async () => {

        if (!passport && !licence && !licenceBack) {
            // setUploadError(true)

            return
        }
        //   setUploadError(false)
        const userRef = doc(db, "users", auth.currentUser?.uid)
        const getPassport = passport[0].originFileObj
        const getLicence = licence[0].originFileObj
        const getLicenceBack = licenceBack[0].originFileObj

        console.log(getLicence, getPassport, getLicenceBack)
        console.log(licence, passport, licenceBack)


        try {

            // passport
            const passportfile = `${auth?.currentUser?.displayName}-${"passport"}`
            const reference = ref(getStorage(), passportfile)
            await uploadBytesResumable(reference, getPassport)
            const downloadURL = await getDownloadURL(reference);
            await updateDoc(userRef, { passport: downloadURL })


            // // licence
            const passportfileL = `${auth?.currentUser?.displayName}-${"licence"}`
            const referenceL = ref(getStorage(), passportfileL)
            await uploadBytesResumable(referenceL, getLicence)
            const downloadURLL = await getDownloadURL(referenceL);
            await updateDoc(userRef, { licence: downloadURLL })


            // // licenceBack

            const passportfileLB = `${auth.currentUser?.displayName}-${"licenceBack"}`
            const referenceLB = ref(getStorage(), passportfileLB)
            await uploadBytesResumable(referenceLB, getLicenceBack)
            const downloadURLLB = await getDownloadURL(referenceLB);
            await updateDoc(userRef, { licenceBack: downloadURLLB })

        } catch (e) {
            console.log(e.message)
        }

    }







    const submitPress = async (data, e) => {
        e.preventDefault()


        try {
            const userRef = doc(db, "users", auth.currentUser?.uid)
            if (auth.currentUser?.displayName !== data.Full_Name) {
                await updateProfile(auth.currentUser, { displayName: data.Full_Name })
                await updateDoc(userRef, { Name: data.Full_Name })
            }

            if (auth.currentUser.phoneNumber !== data.Phone_number) {
                await updateDoc(userRef, { phoneNumber: data.Phone_number })
            }

            await updateDoc(userRef, { bankName: data.Bank_Name, accountNumber: data.Account_Number, accountName: data.Account_Name, swiftCode: data.Swift_Code })
            await updateDoc(userRef, { DOB: Timestamp(dob) })

        } catch (error) {

        }

    }




    return (
        <section className="bg-white overflow-auto h-full p-5">
            <div className='flex justify-between p-5'>
                <h2 className='text-blue-950 font-bold text-xl'>My Profile</h2>
                <button className={edit ? "text-red-500" : 'text-green-600'} onClick={() => {
                    setEdit((current) => !current)

                }}> {!edit ? "Done" : "Edit Profile"}</button>
            </div>


            <form onSubmit={handleSubmit(submitPress)} className="flex flex-col gap-6 mt-5">
                <div className="col-span-6 sm:col-span-3">
                    <Inputelement disable={edit} label="Full Name" name="Full_Name" control={control} rules={{ required: true }} />
                </div>

                <div className="col-span-6">
                    <Inputelement disable={true} label="Email" name="Email" control={control} rules={{
                        required: "This field is required.", pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: 'Enter a valid e-mail address',
                        }
                    }} />

                </div>
                <div className="col-span-6">
                    <p>Date of Birth {dob?.toString()}</p>

                    <DatePicker disabled={edit} onChange={onChange} className='w-full py-3' format={dateFormat} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <Inputelement disable={edit} label="Phone Number" name="Phone_number" control={control} rules={{ required: true }} />

                </div>

                <h2 className='text-blue-950 font-bold text-xl underline'>Withdrawal Settings</h2>

                <div className="col-span-6 sm:col-span-3">
                    <Inputelement disable={edit} label="Bank Name" name="Bank_Name" control={control} rules={{ required: true }} />

                </div>
                <div className="col-span-6 sm:col-span-3">
                    <Inputelement disable={edit} label="Account Name" name="Account_Name" control={control} rules={{ required: true }} />

                </div>
                <div className="col-span-6 sm:col-span-3">
                    <Inputelement disable={edit} label="Account Number" name="Account_Number" control={control} rules={{ required: true }} />

                </div>


                <div className="col-span-6 sm:col-span-3">
                    <Inputelement disable={edit} label="Swift Code" name="Swift_Code" control={control} rules={{ required: true }} />

                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4 mb-5">
                    <button
                        disabled={edit}

                        className="inline-block shrink-0 rounded-md border border-blue-950 bg-blue-950 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    >
                        Save Changes
                    </button>
                </div>

            </form>


            <form className="flex flex-col gap-6 mt-5">

                <div>
                    <h2 className='text-blue-950 font-bold md:text-xl underline'>Account Verification</h2>

                    <h3 className='text-blue-950 font-bold lg:text-lg sm:w-10/12 text-center  mt-3 mx-auto'>KYC Verification - Upload documents below to get verified.</h3>
                    <p className='text-justify text-sm text-gray-400'>Valid identity card. (e.g. Drivers licence, international passport or any government approved document.)</p>

                </div>

                <div className=''>
                    <div>
                        <h2 className='text-blue-950 font-bold md:text-xs pb-2 '>Licence front cover</h2>
                        <UseImage photoUrl={licenceUrl} fileList={licence} setFileList={setLicence} />
                    </div>

                    <div>
                        <h2 className='text-blue-950 font-bold md:text-xs pb-2'>Licence back cover</h2>
                        <UseImage photoUrl={licenceBackUrl} fileList={licenceBack} setFileList={setLicenceBack} />
                    </div>
                    <div>
                        <h2 className='text-blue-950 font-bold md:text-xs pb-2'>Passport Photograph</h2>
                        <UseImage photoUrl={passporteUrl} fileList={passport} setFileList={setPassport} />
                    </div>
                </div>



                <div className="col-span-6 sm:flex sm:items-center sm:gap-4 mb-5">
                    <button
                        onClick={handleImagesSubmit}
                        className="inline-block shrink-0 rounded-md border border-blue-950 bg-blue-950 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    >
                        Submit documents
                    </button>
                </div>
            </form>

        </section>
    )
}
