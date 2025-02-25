import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:5000/api/login', data, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      console.log(response.data);
      alert(response.data.message); 

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Login Faild!';
      alert(errorMessage); 
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email:</p>
          <input
            type="email" // ইমেইল ফরম্যাট চেক করার জন্য
            placeholder="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          <p>Password:</p>
          <input
            type="password" // পাসওয়ার্ড লুকানোর জন্য
            placeholder="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">লগইন</button>
      </form>

      <Link to='/register'>switch to register</Link>
    </div>
  );
};

export default Login;