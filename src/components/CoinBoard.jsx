import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Avatar } from 'antd'
import { db, auth } from '../config/firebaseConfig'

export const CoinBoard = ({ trigger }) => {
  const [selectedId, setSelectedId] = useState()
  const [token, setToken] = useState(null)


  useEffect(() => {


    const refDoc = doc(db, "users", auth.currentUser.uid)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists()) {
        const { token } = snapshot.data()
        setToken(token)




      }
    })

    return () => unsub()
  }, [])


  const handleSelected = async (item) => {
    // setSelectedId(item.id)

    try {
      const userRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userRef, {
        selectedCoin: {
          amount: item.amt,
          name: item.id,
          address: item.address,
          title: item.title

        }
      })
      trigger(false)

    } catch (error) {
      console.log(error)

    }

  }



  const DATA = [
    {
      id: 'BTC',
      title: 'Bitcoin',
      amt: token?.BTC,
      img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=024",
      address: "1GKpL6QtazVRdBTPeqeFqpZYif6a6Jfsku"
    },
    {
      id: 'ETH',
      title: 'Ethereum',
      amt: token?.ETH,
      img: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",
      address: "0x977be2b4dd4216fa4386a5d594676f3f5ba8b9d9"
    },
    {
      id: 'LTC',
      title: 'Litecoin',
      amt: token?.LTC,
      img: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=024",
      address: "LWPGCyu2oc7VV33X3zmth7XfNyzqk4dTBN"
    },

    {
      id: 'BNB',
      title: 'BNB Smart Chain',
      amt: token?.BNB,
      img: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=024",
      address: "LWPGCyu2oc7VV33X3zmth7XfNyzqk4dTBN"
    },
    {
      id: 'USDT',
      title: 'Tether',
      amt: token?.USDT,
      img: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=024",
      address: "TUPqzJLsE1ge3AMgGrZpubLD2cWX2Xqgu1"
    },

  ]


  return (
    <div className='flex flex-col w-full lg:w-4/5 xl:w-4/6 mx-auto'>
      <h2 className='text-center font-bold text-2xl text-blue-950 mb-6'>Discover Asset</h2>

      <div className='flex flex-col gap-3'>
        {DATA.map(item => (
          <div onClick={() => handleSelected(item)} key={item.id} className='flex flex-1 p-1 rounded-lg text-white text-lg bg-blue-800 px-3 cursor-pointer'>
            <div className='flex items-center gap-3'>
              <Avatar size="small" icon={<img src={item.img} alt="coin" />} />
              <span>{item.title}</span>
            </div>
            <span className='ml-auto'>{item.amt} {item.id}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
