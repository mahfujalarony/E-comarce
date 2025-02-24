import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import './App.css'
import Register from './components/Register'
import HomePage from './components/HomePage'
import Login from './components/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
  )
}

export default App
