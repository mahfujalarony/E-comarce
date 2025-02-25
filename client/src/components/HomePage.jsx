import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logout from './Logout';
import useAuth from './useAuth';
import UserList from './UserList';

const HomePage = () => {

  const login = useAuth();

  return (
    <div>
      
      <h1>HomePage</h1>
      {login ? (
        <p>user login</p>
      ) : (
        <p>user not login</p>
      )}

      <Logout />
      <Link to={'/login'}>Login</Link>
      <Link to={'/register'}>Register</Link>

      <div>
        <UserList />
      </div>
    </div>
  )
}

export default HomePage
