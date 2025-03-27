import React, { useState } from "react";
import UserList from "./Admin/UserList";
import OrderController from "./Admin/OrderControler";
import CreateProduct from "./Admin/CreateProduct";
import RemoveProduct from "./Admin/RemoveProduct";
import { FaUsers, FaBoxOpen, FaPlus, FaTrash, FaBars } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const sections = [
    { id: "users", label: "Users", icon: <FaUsers /> },
    { id: "orders", label: "Orders", icon: <FaBoxOpen /> },
    { id: "create-product", label: "Create Product", icon: <FaPlus /> },
    { id: "remove-product", label: "Remove Product", icon: <FaTrash /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
  
      <button
        className="fixed top-24 left-0 p-2 bg-gray-800 text-white rounded-md lg:hidden z-50 hover:bg-gray-700 transition duration-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="w-6 h-6" />
      </button>

      <div
        className={`mt-12 md:mt-0 fixed lg:relative inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 
        top-[calc(60px)] h-[calc(100vh-60px)] lg:top-0 lg:h-screen shadow-lg`}
      >
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400">Admin Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your platform</p>
        </div>
        <ul className="p-4 space-y-2">
          {sections.map((section) => (
            <li
              key={section.id}
              className={`flex items-center p-3 rounded-md cursor-pointer transition duration-200 ${
                activeSection === section.id
                  ? "bg-yellow-500 text-gray-900"
                  : "hover:bg-gray-800 text-gray-200"
              }`}
              onClick={() => handleSectionChange(section.id)}
            >
              <span className="mr-3">{section.icon}</span>
              <span>{section.label}</span>
            </li>
          ))}
        </ul>
      </div>

     
      <div className="flex-1 p-6 pt-[calc(60px+1rem)] lg:pt-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            {sections.find((s) => s.id === activeSection)?.label}
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeSection === "users" && <UserList />}
            {activeSection === "orders" && <OrderController />}
            {activeSection === "create-product" && <CreateProduct />}
            {activeSection === "remove-product" && <RemoveProduct />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;