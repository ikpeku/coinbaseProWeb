import React, { useEffect, useState } from 'react'
import { QRCode, Alert } from 'antd'
import { WalletFilled } from '@ant-design/icons'
import { auth, db } from '../config/firebaseConfig';
import { doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import { useForm } from 'react-hook-form';
import { uuidv4 } from '@firebase/util';

export const Deposit = () => {
    const [transaction, setTransction] = useState([])
    const [selectedCoin, setSelectedCoin] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            Amount: "",

        }
    });

    useEffect(() => {
        const refDoc = doc(db, "users", auth.currentUser.uid)

        const unsub = onSnapshot(refDoc, (snapshot) => {
            if (snapshot.exists()) {
                const { transactions, selectedCoin } = snapshot?.data()
                setTransction(transactions)
                setSelectedCoin(selectedCoin)

            }
        })
        return () => unsub()

    }, [])


    const onSubmit = async data => {

        setIsSuccess(false)
        setIsError(false)

        try {
            const userRef = doc(db, "users", auth.currentUser.uid)


            const timeNow = Timestamp.now()

            await updateDoc(userRef, {
                Deposit: {
                    amount: data?.Amount,
                    status: true,
                    type: "deposit"

                },
                transactions: [{ type: "deposit", amount: data?.Amount, status: false, name: selectedCoin?.name, time: timeNow, id: uuidv4() }, ...transaction]

            })
            setIsError(false)
            setIsSuccess(true)


        } catch (error) {
            setIsSuccess(false)
            setIsError(true)


        }
    }


    return (
        <div className='text-center max-h-full overflow-y-scroll'>
            {isSuccess && <Alert
                message="Successful"
                description="Deposit verification send sucessfull."
                type="success"
                showIcon
                closable
                onClose={() => setIsSuccess(false)}
            />}
            {
                isError &&
                <Alert
                    message="Error"
                    description={isError ? "Deposit verification failed try again." : isError}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setIsError(false)}
                />}

            <h2 className='font-bold text-lg text-blue-950 pb-6'>Deposit {selectedCoin?.title}</h2>
            <div className='flex flex-col justify-center items-center'>
                {selectedCoin?.address && <QRCode value={selectedCoin?.address} />}
                <p className='text-xs'>{selectedCoin?.address}</p>
            </div>

            <div className='mt-4 bg-blue-500 rounded-md p-6 text-white'>
                <p>Send only {selectedCoin?.title} ({selectedCoin?.name}) to this
                    address.</p>
                <p>Sending any other may coins may result in permanent loss.</p>
            </div>

            <form className='w-4/5 lg:w-1/2 mx-auto mt-8' onSubmit={handleSubmit(onSubmit)}>


                <div className='text-start flex items-center bg-orange-100 p-3 gap-3 rounded-lg'>

                    <WalletFilled className='text-blue-950' size={24} />
                    <div>
                        <h2 className='text-md font-bold text-blue-950'>Deposit from exchange </h2>
                        <p>By direct transfer from your account</p>
                    </div>
                </div>


                <div className='pt-6'>
                    <h2 className='text-lg text-blue-950 text-start'>Deposit Amount</h2>
                    <input className={errors?.Amount?.type === "required" ? "border rounded-md border-red-500 w-full p-3" : "border rounded-md p-2 w-full"} type="number" placeholder="input amount" {...register("Amount", { required: "required", min: { value: 0, message: "No negative value" } })} />
                    <p className='text-red-500 mb-2 text-start'>{errors?.Amount?.message}</p>

                </div>



                <div className="col-span-6 sm:flex sm:items-center sm:gap-4 my-5">
                    <button
                        type='submit'
                        // onClick={handleImagesSubmit}
                        className="inline-block shrink-0 rounded-md border border-blue-950 bg-blue-950 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                    >
                        Verify Deposit
                    </button>
                </div>
            </form>

        </div>
    )
}
