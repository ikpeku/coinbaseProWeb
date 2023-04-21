import React, { useState, useEffect } from 'react'
import { Deposit_Withdrawal } from './Deposit_Withdrawal'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../config/firebaseConfig'
import { Empty } from 'antd';

export const Favcoin = () => {
    const [trnHistory, setTransaction] = useState([])

    useEffect(() => {
        const refDoc = doc(db, "users", auth.currentUser.uid)

        const unsub = onSnapshot(refDoc, (snapshot) => {
            if (snapshot.exists()) {
                const { transactions } = snapshot?.data()
                setTransaction(transactions.sort((a, b) => a?.time < b?.time))

            }
        })
        return () => unsub()

    }, [])


    // .sort((a, b) => a.time < b.time)

    return (
        <div className='border-blue-950 border-1 rounded-t-lg rounded-mdflex flex-1 flex-col border overflow-auto'>
            <div className='border text-center font-bold rounded-t-lg text-white py-5 bg-blue-950  '>
                <h2 className=''>Transactions</h2>
            </div>

            {<div className=' '>
                {trnHistory.length === 0 ?

                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    :
                    trnHistory.map(history => <Deposit_Withdrawal key={history.id} history={history} />)
                }
            </div>}
        </div>
    )
}
