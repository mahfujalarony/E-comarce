import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      alert(response.data.message);

     
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Login Faild !';
      alert(errorMessage);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <p>ইমেইল:</p>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          <p>Password:</p>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <Link to="/register">Switch to Register</Link>
    </div>
  );
};

export default Login;