// Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      photo: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('photo', formData.photo);

    try {
      const response = await axios.post('http://localhost:5000/api/register', data);
      console.log(response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert(response.data.message);

    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Name:</p>
          <input 
            type="text" 
            name="name"
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
          />
        </label>

        <label>
          <p>Email:</p>
          <input 
            type="email" 
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          <p>Password:</p>
          <input 
            type="password" 
            name="password"
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label>
          <p>Upload Photo:</p>
          <input 
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>

        <button type="submit">Register</button>
      </form>
      <Link to='/login'>swith to login</Link>
    </div>
  );
};

export default Register;