import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        alert('You are successfully logout !')
    }
  return (
    <div onClick={handleLogout}>
      Logout
    </div>
  )
}

export default Logout
