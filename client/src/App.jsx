import { useState } from 'react'


import './App.css'
import Register from './components/Register'
import HomePage from './components/HomePage'
import Login from './components/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div>
        <Register />
      </div>
  )
}

export default App
