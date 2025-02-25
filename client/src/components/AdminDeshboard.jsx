import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Fetch Faild:', err);
      }
    };
    fetchUsers();
  }, []);

  const makeAdmin = async (email) => {
    try {
      await axios.put('http://localhost:5000/api/make-admin', { email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map(user => 
        user.email === email ? { ...user, role: 'admin' } : user
      ));
      alert('Now User is Admin!');
    } catch (err) {
      alert(err.response?.data?.message || 'Faild to make Admin!');
    }
  };

  
  const removeAdmin = async (email) => {
    try {
      await axios.put('http://localhost:5000/api/remove-admin', { email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map(user => 
        user.email === email ? { ...user, role: 'user' } : user
      ));
      alert('Remove Admin!');
    } catch (err) {
      alert(err.response?.data?.message || 'Faild to remove Admin!');
    }
  };

  const removeUser = async (email) => {
    try {
      await axios.delete('http://localhost:5000/api/delete-user', {
        data: { email },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter(user => user.email !== email)); 
      alert('Remove user successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Faild to remove user!');
    }
  };

  return (
    <div>
      <h1>Admin Deshboard</h1>
      <ul>
        {users.map(user => (
          <li key={user.email}>
            {user.name} ({user.role})
            {user.role !== 'admin' && (
              <button onClick={() => makeAdmin(user.email)}>Make Admin</button>
            )}
            {user.role === 'admin' && (
              <button onClick={() => removeAdmin(user.email)}>Remove Admin</button>
            )}
            <button onClick={() => removeUser(user.email)}>Remove User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;