import React, { useState, useEffect, useMemo } from 'react'
import { Upload, Image } from 'antd';
import { uuidv4 } from '@firebase/util';

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
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';



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
                        photo: null
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



    // const props = {
    //     name: 'file',
    //     // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //     // headers: {
    //     //   authorization: 'authorization-text',
    //     // },
    //     onChange(info) {


    //         console.log(info.file, info.fileList);


    //         // if (info.file.status !== 'uploading') {
    //         //     console.log(info.file, info.fileList);
    //         // }
    //         // if (info.file.status === 'done') {
    //         //     message.success(`${info.file.name} file uploaded successfully`);
    //         // } else if (info.file.status === 'error') {
    //         //     message.error(`${info.file.name} file upload failed.`);
    //         // }
    //     },
    // };


    const [info, setInfo] = useState(null)



    useEffect(() => {
        if (!info) return



        if (info.file) {
            // console.log("myInFo:", info.file)

            (async () => {

                // console.log(info.fileList)
                // const res = await fetch(info.file)

                // const blobFile = await res.blob()
                const blobFile = info.file

                // console.log(blobFile)




                const photo = `${auth.currentUser?.displayName}-${uuidv4()}`

                const reference = ref(getStorage(), photo)
                await uploadBytesResumable(reference, blobFile)
                const downloadURL = await getDownloadURL(reference);
                // console.log("link: ", downloadURL)

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
                                message: null,
                                timestamp: new Date(),
                                photo: downloadURL
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





            })()


            setInfo(null)
        }
        setInfo(null)
    }, [info])



    const Item = ({ item }) => {
        let time = item?.messages?.timestamp?.toDate()



        return (

            <>

                {item?.messages?.message && <div className={item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? `bg-[#3376bc] ml-auto max-w-fit rounded-md p-2 my-2 mx-3 overflow-auto` : `bg-[lightgrey] mr-auto max-w-fit rounded-md p-2 my-2 mx-3 overflow-auto`}>
                    <p className={!item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "text-black" : "text-white" + "text-lg"}>{item?.messages?.message}</p>
                    <p className={item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "text-[lightgray] text-sm italic text-right" : "text-black text-sm italic text-right"}>{moment(time).fromNow()}</p>
                </div >}

                {item?.messages?.photo && <div className={item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? `bg-[#3376bc] ml-auto max-w-fit rounded-md p-2 my-2 mx-3 overflow-auto` : `bg-[lightgrey] mr-auto max-w-fit rounded-md p-2 my-2 mx-3 overflow-auto`}>
                    {/* <p className={!item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "text-black" : "text-white" + "text-lg"}>{item?.messages?.message}</p> */}
                    <Image src={item?.messages?.photo} alt="avatar"
                        width={200}

                    // className='w-full aspect-square' 
                    />

                    <p className={item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "text-[lightgray] text-sm italic text-right" : "text-black text-sm italic text-right"}>{moment(time).fromNow()}</p>
                </div >}



            </>


        )
    }


    return (

        <div className='px-5 flex flex-col overflow-auto'>
            <div className=''>
                {
                    allMessages.map(item => <Item key={item.id} item={item} />)
                }
            </div>
            <div className='flex gap-1 items-center flex-col mt-2' >

                <textarea rows={4} className='w-full border px-3 rounded-md bg-[#f2f2f2] resize-y max-h-80 outline-none overflow-auto' placeholder='send message ....' value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />

                <div className='flex w-full justify-center gap-5'>
                    <div className='bg-blue-950 p-2 w-1/3 rounded-md'>
                        <button onClick={sendMessage} className='text-white text-center w-full'>send Message</button>
                    </div>
                    <div className='bg-blue-950 p-2 w-1/3 rounded-md flex '>
                        <Upload onChange={(e) => setInfo(e)} beforeUpload={() => false} showUploadList={false} >
                            {/* <div className='flex items-center '> */}

                            <button className='text-white text-center w-full'>send Photo</button>
                            {/* </div> */}
                        </Upload>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Chat
