import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Problem to Fetch user:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user); 
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => handleUserClick(user)}
            style={{ cursor: 'pointer', color: selectedUser?.id === user.id ? 'blue' : 'black' }}
          >
            {user.name}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>User Details</h3>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email || 'নেই'}</p>
          <p>ID: {selectedUser.id}</p>
        </div>
      )}
    </div>
  );
}

export default UserList;