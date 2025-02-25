import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import './App.css'
import Register from './components/Register'
import HomePage from './components/HomePage'
import Login from './components/Login'
import Cart from './components/Cart'
import Navbar from './components/Navbar'
import AdminDashboard from './components/AdminDeshboard'
import { AuthProvider } from './components/AuthContext'


function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div>
        <AuthProvider>
        <BrowserRouter>
          <div>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/admin' element={<AdminDashboard />} />
          </Routes>
          </div>
        </BrowserRouter>

        </AuthProvider> 
      </div>
  )
}

export default App
