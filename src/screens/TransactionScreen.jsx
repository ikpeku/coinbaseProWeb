import React, { useContext } from 'react'
import { Withdraw } from '../components/Withdraw'
import { Deposit } from '../components/Deposit'
import { UserContext } from '../context/UserContext'

const TransactionScreen = () => {
    const { transactionType } = useContext(UserContext)

    console.log("get", transactionType)

    return (
        <div>
            {transactionType === "deposit" ? <Deposit />

                : <Withdraw />
            }
        </div>
    )
}

export default TransactionScreen