import { useState, useEffect } from 'react';

const useAuth = () => {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('User Not Login');
        return;
      }

      try {
        const response = await fetch('https://e-comarce-8gj0.onrender.com/api/auth/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setLogin(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.log('something is wrong !');
      }
    };

    verifyToken();
  }, []);

  return login;
};

export default useAuth;