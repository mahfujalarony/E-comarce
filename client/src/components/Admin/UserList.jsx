import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://e-comarce-iuno.vercel.app/api/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Problem fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(selectedUser?.email === user.email ? null : user);
  };

  const makeAdmin = async (email) => {
    try {
      await axios.put(
        "https://e-comarce-iuno.vercel.app/api/users/make-admin",
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, role: "admin" } : user
        )
      );
      alert("User is now an Admin!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to make Admin!");
    }
  };

  const removeAdmin = async (email) => {
    try {
      await axios.put(
        "https://e-comarce-iuno.vercel.app/api/users/remove-admin",
        { email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, role: "user" } : user
        )
      );
      alert("Admin role removed!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove Admin!");
    }
  };

  const removeUser = async (email) => {
    try {
      await axios.delete("https://e-comarce-iuno.vercel.app/api/users/delete-user", {
        data: { email },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      if (selectedUser?.email === email) setSelectedUser(null);
      alert("User removed successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove user!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Admin Dashboard - User Management
        </h1> */}

        <div className="flex flex-col lg:flex-row gap-6">
      
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              User List ({users.length})
            </h2>
            <ul className="space-y-4 max-h-[70vh] overflow-y-auto">
              {users.map((user) => (
                <li key={user.email}>
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedUser?.email === user.email
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {user.email} ({user.role})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {user.role !== "admin" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              makeAdmin(user.email);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role === "admin" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAdmin(user.email);
                            }}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
                          >
                            Remove Admin
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUser(user.email);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                   
                    {selectedUser?.email === user.email && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 lg:hidden">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                          User Details
                        </h3>
                        <div className="space-y-2 text-gray-700">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {selectedUser.name}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {selectedUser.email || "নেই"}
                          </p>
                          <p>
                            <span className="font-medium">ID:</span>{" "}
                            {selectedUser.id}
                          </p>
                          <p>
                            <span className="font-medium">Role:</span>{" "}
                            {selectedUser.role}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              {users.length === 0 && (
                <li className="text-center text-gray-500 py-6">
                  No users found.
                </li>
              )}
            </ul>
          </div>

   
          <div className="hidden lg:block w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                User Details
              </h3>
              {selectedUser ? (
                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedUser.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedUser.email || "Not found"}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span> {selectedUser.id}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {selectedUser.role}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">Select a user to see details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;