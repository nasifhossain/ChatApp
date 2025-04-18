import { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile'


function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Fragment>
  )
}

export default App
