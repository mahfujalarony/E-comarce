import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { AuthContext } from './AuthContext'; 

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoggedIn, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-yellow-400">Ama</span>zon
          </Link>
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
          <div className="flex items-center space-x-6">
            <div className="hover:text-yellow-400 cursor-pointer" onClick={toggleSidebar}>
              <div className="flex items-center">
                <FaUser className="mr-1" />
                <span>{isLoggedIn && user ? user.name : 'Account'}</span>
              </div>
            </div>
            <Link to="/cart" className="flex items-center hover:text-yellow-400">
              <FaShoppingCart className="mr-1" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Body Content Adjust for Fixed Navbar */}
      <div className="mt-16">
        {/* এই `mt-16` এর ফলে কন্টেন্ট Navbar-এর নিচে চলে যাবে */}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white hover:text-yellow-400 text-2xl"
        >
          ×
        </button>
        <div className="p-4">
          <h2 className="text-xl font-bold">Account</h2>
          <ul className="mt-4">
            <li className="mb-2" onClick={() => setIsSidebarOpen(false)}>
              <Link to='/profile'>Profile</Link>
            </li>
            <li className="mb-2" onClick={() => setIsSidebarOpen(false)}> 
              <Link to='/myorders'>My Orders</Link>
            </li>
            {isLoggedIn ? (
              <li className="mb-2 cursor-pointer" onClick={() => { logout(); setIsSidebarOpen(false); }}>
                Logout
              </li>
            ) : (
              <li className="mb-2 cursor-pointer" onClick={handleLoginClick}>
                Login
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" onClick={() => setIsSidebarOpen(false)}>Admin</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
