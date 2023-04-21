import React, { createContext, useReducer, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebaseConfig';




export const UserContext = createContext({
    user: null,
    isLoading: false,
    isError: null,
    isSuccess: false,
    transactionType: ""
})


const initialState = {
    user: null,
    isLoading: false,
    isError: null,
    isSuccess: false,
    transactionType: ""
};


function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload, isSuccess: true, };
        case 'LOGOUT':
            return { ...state, isSuccess: true, user: null };
        case 'ISLOADING':
            return { ...state, isLoading: true };
        case "TRANSACTION":
            return { ...state, transactionType: action.payload }
        default:
            return state;
    }
}


export const UserProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);



    useEffect(() => {
        dispatch({ type: 'ISLOADING' })
        const unSubquire = onAuthStateChanged(auth, (user) => {

            if (user) {
                dispatch({ type: 'LOGIN', payload: user })
            } else {
                dispatch({ type: 'LOGOUT' })
            }

            return unSubquire
        })
    }, [])



    console.log(state.user)

    return <UserContext.Provider value={{
        ...state,
        dispatch,
    }}>{children}</UserContext.Provider>
}