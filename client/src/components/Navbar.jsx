// Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import Logout from './Logout';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const login = useAuth();
  const user = login ? JSON.parse(localStorage.getItem('user')) : null;
  const navigate = useNavigate(); // useNavigate hook for navigation

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
    setIsSidebarOpen(false); // Close the sidebar
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-yellow-400">Ama</span>zon
          </Link>

          {/* Search Bar */}
          <div className="flex mx-4">
            <input
              type="text"
              placeholder="Search Amazon"
              className="w-full p-2 rounded-l-md text-black focus:outline-none"
            />
            <button className="bg-yellow-400 text-black p-2 rounded-r-md hover:bg-yellow-500">
              Search
            </button>
          </div>

          {/* Account and Cart Links */}
          <div className="flex items-center space-x-6">
            {/* Account Link */}
            <div className="hover:text-yellow-400 cursor-pointer" onClick={toggleSidebar}>
              <div className="flex items-center">
                <FaUser className="mr-1" />
                <span>{login && user ? user.name : 'Account'}</span>
              </div>
            </div>

            {/* Cart Link */}
            <Link to="/cart" className="flex items-center hover:text-yellow-400">
              <FaShoppingCart className="mr-1" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Close Button (Cross Icon) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white hover:text-yellow-400 text-2xl"
        >
          &times; {/* This is the cross symbol */}
        </button>

        {/* Sidebar Content */}
        <div className="p-4">
          <h2 className="text-xl font-bold">Account</h2>
          <ul className="mt-4">
            <li className="mb-2">Profile</li>
            <li className="mb-2">Orders</li>
            {/* Show Login or Logout based on login status */}
            {login ? (
              <li className="mb-2">
                <Logout />
              </li>
            ) : (
              <li className="mb-2 cursor-pointer" onClick={handleLoginClick}>
                Login
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;