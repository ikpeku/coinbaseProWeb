import React, { useState, useEffect, useMemo } from 'react'

import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import moment from 'moment';
import { auth, db } from '../config/firebaseConfig';



const Chat = ({ route }) => {


    const [chatMessage, setChatMessage] = useState("");

    const [allMessages, setAllMessages] = useState([]);

    const [userData, setUserData] = useState(undefined)
    const [isSending, setIsSending] = useState(false)

    const user = auth.currentUser;

    const userId = route?.params?.id


    useMemo(() => {

        if (user.uid !== "21vftV7EKUOu5kCAP11WyygDUFG2") {
            (async () => {
                const docref = doc(db,
                    "chatUser",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    user.uid)

                const ref = await getDoc(docref)
                if (ref.exists()) {
                    await updateDoc(docref, {
                        isNewUserMessage: 0,
                    })
                    setUserData(ref.data())

                }
            })()

        }
    }, [userData])




    useEffect(() => {


        const unsub = onSnapshot(
            query(
                collection(
                    db,
                    "chat",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    user?.uid,
                    "messages"
                ),
                orderBy("timestamp")
            ),
            (snapshot) => {
                setAllMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        messages: doc.data(),
                    }))
                );
            }
        );
        return unsub;

    }, []);



    const sendMessage = async () => {

        if (chatMessage.trim() === "") return
        if (isSending) return
        setIsSending(true)



        try {
       
            if (user.uid !== "21vftV7EKUOu5kCAP11WyygDUFG2") {


                await addDoc(
                    collection(
                        db,
                        "chat",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        user.uid,
                        "messages"
                    ),
                    {
                        username: user.displayName,
                        messageUserId: user.uid,
                        message: chatMessage?.trim(),
                        timestamp: new Date(),
                    }
                );

                const docref = doc(db,
                    "chatUser",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    user.uid)

                const ref = await getDoc(docref)
                if (ref.exists()) {
                    await updateDoc(docref, {
                        isNewAdminMessage: userData.isNewAdminMessage + 1,
                        user: user.uid,
                    })

                } else {
                    await setDoc(docref, {
                        user: user.uid,
                        isNewAdminMessage: 1
                    })
                }

            }

        } catch (error) {

        }
        setChatMessage("");
        setIsSending(false)

    };




    const Item = ({ item }) => {
        let time = item?.messages?.timestamp?.toDate()



        return (

            <div className={item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? `bg-[#3376bc] ml-auto max-w-fit rounded-md p-2 my-2 mx-3 ` : `bg-[lightgrey] mr-auto max-w-fit rounded-md p-2 my-2 mx-3`}>
                <h2 className={!item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "text-black" : "text-white" + "text-lg"}>{item?.messages?.message}</h2>
                <p className={item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "text-[lightgray] text-sm italic text-right" : "text-black text-sm italic text-right"}>{moment(time).fromNow()}</p>
            </div >

        )
    }


    return (

        <div className='px-5 flex flex-col overflow-auto'>
            <div className=''>
                {
                    allMessages.map(item => <Item key={item.id} item={item} />)
                }
            </div>
            <div className='flex gap-1 items-center flex-col' >
                <textarea rows={4} className='w-full border px-3 rounded-md bg-[#f2f2f2] resize-y max-h-80 outline-none overflow-auto' placeholder='send message ....' value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                <div className='bg-blue-950 p-2 w-1/3 rounded-md'>
                    <button onClick={sendMessage} className='text-white text-center w-full'>send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat
