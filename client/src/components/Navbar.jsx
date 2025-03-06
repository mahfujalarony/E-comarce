import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // New state for logout confirmation
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if token exists in localStorage
  const checkToken = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Handle login redirect from modal
  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false);
    setIsSidebarOpen(false);
    navigate('/login');
  };

  // Close login modal
  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
  };

  // Handle Profile click with token check
  const handleProfileClick = () => {
    if (checkToken()) {
      navigate('/profile');
      setIsSidebarOpen(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Handle My Orders click with token check
  const handleOrdersClick = () => {
    if (checkToken()) {
      navigate('/myorders');
      setIsSidebarOpen(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Handle Cart click with token check
  const handleCartClick = (e) => {
    e.preventDefault();
    if (checkToken()) {
      navigate('/cart');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true); // Show logout confirmation popup
  };

  // Confirm logout
  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    setIsSidebarOpen(false);
  };

  // Cancel logout
  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link to="/" className="text-xl sm:text-2xl font-bold">
              <span className="text-yellow-400">Ama</span>zon
            </Link>
            {/* Hamburger Menu for Mobile */}
            <button
              onClick={toggleSidebar}
              className="sm:hidden text-2xl text-white hover:text-yellow-400 focus:outline-none"
            >
              <FaBars />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex w-full sm:w-1/2 max-w-lg">
            <input
              type="text"
              placeholder="Search Amazon"
              className="w-full p-2 rounded-l-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 text-black p-2 rounded-r-md hover:bg-yellow-500 transition duration-300"
            >
              Search
            </button>
          </div>

          {/* Navbar Links */}
          <div className="hidden sm:flex items-center space-x-6">
            <div
              className="flex items-center hover:text-yellow-400 cursor-pointer"
              onClick={toggleSidebar}
            >
              <FaUser className="mr-1" />
              <span>{isLoggedIn && user ? user.name : 'Account'}</span>
            </div>
            <Link
              to="/cart"
              onClick={handleCartClick}
              className="flex items-center hover:text-yellow-400"
            >
              <FaShoppingCart className="mr-1" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Body Content Adjust for Fixed Navbar */}
      <div className="mt-16"></div>

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
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Account Menu</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={handleProfileClick}
                className="w-full text-left hover:text-yellow-400 transition duration-300"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleOrdersClick}
                className="w-full text-left hover:text-yellow-400 transition duration-300"
              >
                My Orders
              </button>
            </li>
            <li>
              <button
                onClick={handleCartClick}
                className="w-full text-left hover:text-yellow-400 transition duration-300"
              >
                Cart
              </button>
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogoutClick} // Updated to show confirmation popup
                  className="w-full text-left hover:text-yellow-400 transition duration-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLoginRedirect}
                  className="w-full text-left hover:text-yellow-400 transition duration-300"
                >
                  Login
                </button>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block hover:text-yellow-400 transition duration-300"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Login Required</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              You need to log in to access this feature. Would you like to log in now?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={handleLoginCancel}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Logout</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmLogout}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;