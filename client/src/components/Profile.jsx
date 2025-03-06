import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // Handle navigation to home or products page
  const handleGoBack = () => {
    navigate('/'); // Redirects to home page; you can change to '/products' if preferred
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        {/* Icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Profile icon (replaceable)
          alt="Profile Under Construction"
          className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 opacity-80"
        />

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Profile Feature Coming Soon!
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6">
          We’re working hard to bring you a fully functional profile page. Stay tuned—it’ll be available within the next few days!
        </p>

        {/* Button */}
        <button
          onClick={handleGoBack}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default Profile;