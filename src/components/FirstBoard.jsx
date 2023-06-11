import React, { useEffect, useState, useContext, useMemo } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Button, Space, Spin } from 'antd';
import { db, auth } from '../config/firebaseConfig';
import { UserContext } from '../context/UserContext';


export const FirstBoard = ({ transaction }) => {
    const [balance, setBalance] = useState("00:00")
    const [coin, setCoin] = useState("BTC")
    const [isLoading, setIsLoading] = useState(false)
    const [localeBalance, setLocaleBalance] = useState("00:00")


    const { dispatch } = useContext(UserContext)

    useEffect(() => {
        setIsLoading(true)

        const refDoc = doc(db, "users", auth.currentUser?.uid)
        const unsub = onSnapshot(refDoc, (snapshot) => {
            if (snapshot.exists) {
                const { amount, name } = snapshot.data()?.selectedCoin
                setBalance(amount)
                setCoin(name)


            }
        })
        setIsLoading(false)

        return () => unsub()
    }, [])

    const depositPressed = () => {
        transaction(true)
        dispatch({ type: "TRANSACTION", payload: "deposit" })
    }


    const withdrawalPressed = () => {
        transaction(true)
        dispatch({ type: "TRANSACTION", payload: "withdrawal" })
    }


    useMemo(() => {

        if (balance !== "00:00") {
            setLocaleBalance(balance.toLocaleString())
        }


    }, [balance])





    return (
        <div className='flex flex-col flex-1  items-center justify-center relative'>

            {!isLoading && <>
                <h2 className='font-bold text-4xl text-blue-950'>${balance === 0 ? "00:00" : `${localeBalance}`}</h2>
                <p className='my-3'>{coin}</p>
            </>
            }


            {isLoading && <div className='absolute w-full h-full inset-0 flex justify-center items-center backdrop-invert-0'>
                <Spin className='' />

            </div>}

            <Space direction="vertical">
                <Space wrap className=''>
                    <Button onClick={depositPressed} type="primary" className='bg-blue-950' icon={<ArrowUpOutlined />}>
                        Deposit
                    </Button>
                    <Button onClick={withdrawalPressed} type="primary" className='bg-blue-950' icon={<ArrowDownOutlined />}>
                        Withdraw
                    </Button>
                </Space>

            </Space>



        </div>
    )
}
