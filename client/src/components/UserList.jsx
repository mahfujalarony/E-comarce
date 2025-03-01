import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Problem fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const makeAdmin = async (email) => {
    try {
      await axios.put(
        'http://localhost:3001/api/users/make-admin',
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(users.map((user) =>
        user.email === email ? { ...user, role: 'admin' } : user
      ));
      alert('User is now an Admin!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to make Admin!');
    }
  };

  const removeAdmin = async (email) => {
    try {
      await axios.put(
        'http://localhost:3001/api/users/remove-admin',
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(users.map((user) =>
        user.email === email ? { ...user, role: 'user' } : user
      ));
      alert('Admin role removed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove Admin!');
    }
  };

  const removeUser = async (email) => {
    try {
      await axios.delete('http://localhost:3001/api/users/delete-user', {
        data: { email },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.filter((user) => user.email !== email));
      alert('User removed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove user!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Admin Dashboard - User Management
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User List</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.email}
                className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${
                  selectedUser?.email === user.email
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                } border`}
                onClick={() => handleUserClick(user)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">
                    {user.name} ({user.role})
                  </span>
                  <div className="space-x-2">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => makeAdmin(user.email)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => removeAdmin(user.email)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                      >
                        Remove Admin
                      </button>
                    )}
                    <button
                      onClick={() => removeUser(user.email)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Remove User
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* User Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">User Details</h3>
          {selectedUser ? (
            <div className="space-y-3">
              <p className="text-gray-800">
                <span className="font-medium">Name:</span> {selectedUser.name}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Email:</span>{' '}
                {selectedUser.email || 'নেই'}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">ID:</span> {selectedUser.id}
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Role:</span> {selectedUser.role}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Select a user to see details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;