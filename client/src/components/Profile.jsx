import React, { useEffect, useState } from "react";
import { FaUserCircle, FaShoppingCart, FaBoxOpen, FaStore, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userProfile");
    const storedToken = localStorage.getItem("token");

    setToken(storedToken); // টোকেন সেট করা
    if (storedData) {
      setProfileData(JSON.parse(storedData));
    } else {
      setProfileData({
        name: "N/A",
        email: "N/A",
        userId: "N/A",
        photoPath: null,
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("token");
    setToken(null); // টোকেন সেট null করে দেওয়া হলো
    navigate("/");
    window.location.reload();
  };

  if (!profileData) return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Profile Info */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            {profileData.photoPath ? (
              <img
                src={profileData.photoPath}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
                onError={(e) => (e.target.src = "")}
              />
            ) : (
              <FaUserCircle className="w-24 h-24 text-gray-400" />
            )}
            <h1 className="text-xl font-bold mt-2">{profileData.name}</h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>

          {/* Profile Details */}
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">User ID:</span>
              <span>{profileData.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{profileData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>
              <span>{profileData.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Logout/Login - Always at Bottom */}
      <div className="w-full bg-white shadow-md p-4 mt-auto">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FaStore className="mr-2" /> Shop Now
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center justify-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            <FaShoppingCart className="mr-2" /> My Cart
          </button>
          <button
            onClick={() => navigate("/myorders")}
            className="flex items-center justify-center bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
          >
            <FaBoxOpen className="mr-2" /> My Orders
          </button>

          {/* টোকেন থাকলে Logout, না থাকলে Login দেখাবে */}
          {token ? (
            <button
              onClick={() => setShowPopup(true)}
              className="flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <FaSignInAlt className="mr-2" /> Login
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showPopup && (
        <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
              <h2 className="text-lg font-bold mb-4">Are you sure you want to logout?</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default ProfilePage;
