import { useState } from 'react'


import './App.css'
import Register from './components/Register'
import HomePage from './components/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div>
        <Register />
        <HomePage />
      </div>
  )
}

export default App
