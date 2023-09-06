import React,{useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import { auth, db } from '../config/firebaseConfig';
import { doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'
import { uuidv4 } from '@firebase/util';
import { Alert } from 'antd';

export const Withdraw = () => {
    const [transaction, setTransction] = useState([])
    const [selectedCoin,   setSelectedCoin] = useState()
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues:{
            Amount: "",
            Address: ""
        }
    });
    const onSubmit  = async data => {
        setIsError(false)
        setIsSuccess(false)

        if (+data.Amount > +selectedCoin?.amount || +selectedCoin?.amount === 0 || selectedCoin?.amount === "0") {

           setIsError("Insufficient balance")
            return
      
          }
      
    


        try {
            const userRef = doc(db, "users", auth.currentUser.uid)
    
    
            const timeNow = Timestamp.now()
    
            await updateDoc(userRef, {
              Withdraw: {
                amount: data?.Amount,
                status: true,
                type: "withdraw",
                Address: data?.Address
    
              },
              transactions: [ { type: "Withdraw", amount: data?.Amount, status: false, name: selectedCoin?.name, time: timeNow, id: uuidv4(), Address: data?.Address }, ...transaction]
    
    
            })
            setIsError(false)
            setIsSuccess(true)


    
          } catch (error) {
            setIsSuccess(false)
            setIsError(true)
    
          }
    };


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





    return (
        <div className='flex flex-col gap-3 mt-8'>
           { isSuccess &&  <Alert
            message="Successful"
            description="Withdrawal request successful."
            type="success"
            showIcon
            closable
            onClose={() => setIsSuccess(false)}
          />}
          {
            isError && 
              <Alert
            message="Error"
            description={ isError ? "Withdrawal failed try again." : isError}
            type="error"
            showIcon
            closable
            onClose={() => setIsError(false)}
          />}
          
             <form className='w-4/5 lg:w-1/2 mx-auto' onSubmit={handleSubmit(onSubmit)}>
            <h2 className='font-bold text-lg text-blue-950 mb-6 text-center'>Withdraw {selectedCoin?.title}</h2>
          
              <input className={errors?.Address?.type === "required" ? "border rounded-md border-red-500 w-full p-2" : "border rounded-md w-full p-2"} type="text" placeholder={`Enter ${selectedCoin?.name} Address`} {...register("Address", {required: "required"})} />
              <p className='text-red-500 mb-2'>{errors?.Address?.message}</p>


     <div>
         <input className={errors?.Amount?.type === "required" ? "border rounded-md border-red-500 w-full p-2" : "border rounded-md p-2 w-full"} type="number" placeholder="Amount" {...register("Amount", {required: "required", min: {value: 0, message: "No negative value"}})} />
      <p className='text-red-500 mb-2'>{errors?.Amount?.message}</p>

     </div>


            <div className='mb-2'>
                <p className='text-end'>Available balance <span className='text-green-500'>${selectedCoin?.amount}</span></p>
            </div>
            <div className="col-span-6 sm:flex sm:items-center sm:gap-4 mb-5">
                <button
                type='submit'
                    // onClick={handleImagesSubmit}
                    className="inline-block shrink-0 rounded-md border border-blue-950 bg-blue-950 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                    Confirm
                </button>
            </div>
            </form>
        </div>
    )
}





// export default function App() {

//   console.log(errors);
  
//   return (
   
    

//       <input type="submit" />
//     </form>
//   );
// }