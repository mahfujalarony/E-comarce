import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaSearch } from 'react-icons/fa';
import { AuthContext } from './AuthContext';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const checkToken = () => {
    return !!localStorage.getItem('token');
  };

  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false);
    setIsSidebarOpen(false);
    navigate('/login');
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsSidebarOpen(false);
  };

  const handleOrdersClick = () => {
    if (checkToken()) {
      navigate('/myorders');
      setIsSidebarOpen(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (checkToken()) {
      navigate('/cart');
      setIsSidebarOpen(false);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    setIsSidebarOpen(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <div>
      <nav className="bg-gray-900 text-white p-3 shadow-lg fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
  
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-2xl text-white hover:text-yellow-400 focus:outline-none"
            >
              <FaBars />
            </button>
            <Link to="/" className="text-xl md:text-2xl font-bold flex items-center">
              <span className="text-yellow-400">Ama</span>zon
            </Link>
          </div>

     
          <div className="flex-1 max-w-2xl mx-4 hidden md:flex items-center bg-white rounded-md overflow-hidden">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2 text-black focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 text-gray-900 p-2 hover:bg-yellow-500 transition duration-200"
            >
              <FaSearch />
            </button>
          </div>

          
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={toggleSidebar}
              className="flex items-center hover:text-yellow-400 transition duration-200"
            >
              <FaUser className="mr-2" />
              <span>{isLoggedIn && user ? `Hello, ${user.name}` : 'Account'}</span>
            </button>
            <Link
              to="/cart"
              onClick={handleCartClick}
              className="flex items-center hover:text-yellow-400 transition duration-200"
            >
              <FaShoppingCart className="mr-2" />
              <span>Cart</span>
            </Link>
          </div>

          <div className="w-full md:hidden mt-2">
            <div className="flex items-center bg-white rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 text-black focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 text-gray-900 p-2 hover:bg-yellow-500 transition duration-200"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </nav>

     
      <div
        className={`fixed top-0 right-0 h-full w-64 md:w-72 bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {isLoggedIn && user ? `Hello, ${user.name}` : 'Welcome'}
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-2xl hover:text-yellow-400 focus:outline-none"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            <li>
              <button
                onClick={handleProfileClick}
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 transition duration-200"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={handleOrdersClick}
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 transition duration-200"
              >
                My Orders
              </button>
            </li>
            <li>
              <button
                onClick={handleCartClick}
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 transition duration-200"
              >
                Cart
              </button>
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left py-2 px-3 rounded hover:bg-red-600 transition duration-200 text-red-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleLoginRedirect}
                  className="w-full text-left py-2 px-3 rounded hover:bg-gray-700 transition duration-200"
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
                  className="block py-2 px-3 rounded hover:bg-gray-700 transition duration-200"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

    
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Login Required</h3>
            <p className="text-gray-600 mb-4">
              You need to log in to access this feature. Would you like to log in now?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLoginRedirect}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={handleLoginCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Logout</h3>
            <p className="text-gray-600 mb-4">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

     
      <div className="mt-16"></div>
    </div>
  );
};

export default Navbar;