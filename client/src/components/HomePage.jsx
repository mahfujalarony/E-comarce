import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [photoUrl, setPhotoUrl] = useState('');

  const fetchPhoto = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${email}`);
      setPhotoUrl(`http://localhost:5000${response.data.photoPath}`);
    } catch (error) {
      console.error('Error fetching photo:', error);
    }
  };

  // পেজ লোডের সময় ফটো ফেচ করা
  useEffect(() => {
    const userEmail = 'mahfujalamrony07@gmail.com'; // এটা পরে ডায়নামিক করবেন (যেমন Context বা Redux থেকে)
    fetchPhoto(userEmail);
  }, []); // খালি dependency array মানে শুধু পেজ লোডের সময় একবার রান হবে

  return (
    <div className="flex justify-center items-center h-screen">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="User uploaded"
          style={{ maxWidth: '200px', borderRadius: '8px' }}
        />
      ) : (
        <p>Loading photo...</p>
      )}
    </div>
  );
};

export default HomePage;