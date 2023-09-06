

import { useContext } from "react";
import { UserContext } from "./context/UserContext";


import { LoginScreen, RegisterScreen, Home } from './screens';
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {

  const { user, isSuccess } = useContext(UserContext)


  return (
    <>
      {isSuccess && (
        <div>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="login" element={!user ? <LoginScreen /> : <Navigate to="/" replace />} />
            <Route path="register" element={!user ? <RegisterScreen /> : <Navigate to="/" replace />} />
          </Routes>
        </div>
      )}

    </>
  )
}

export default App


