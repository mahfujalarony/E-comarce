import React, { useState } from "react";
import UserList from "./Admin/UserList";
import OrderController from "./Admin/OrderControler";
import CreateProduct from "./Admin/CreateProduct";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("users");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
          
            <button
                className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded lg:hidden z-50"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                </svg>
            </button>

         
            <div
                className={`fixed lg:relative inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 
                top-[calc(60px)] h-[calc(100vh-60px)] lg:top-0 lg:h-screen`}
            >
                <div className="p-4">
                    <h2 className="text-xl font-bold">Admin Dashboard</h2>
                </div>
                <ul className="space-y-2 p-4">
                    <li
                        className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                            activeSection === "users" ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleSectionChange("users")}
                    >
                        Users
                    </li>
                    <li
                        className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                            activeSection === "orders" ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleSectionChange("orders")}
                    >
                        Orders
                    </li>
                    <li
                        className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                            activeSection === "create-product" ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleSectionChange("create-product")}
                    >
                        Create Product
                    </li>
                </ul>
            </div>

     
            <div className="flex-1 p-6 pt-[calc(60px+1rem)] lg:pt-6">
                {activeSection === "users" && <UserList />}
                {activeSection === "orders" && <OrderController />}
                {activeSection === "create-product" && <CreateProduct />}
            </div>
        </div>
    );
};

export default AdminDashboard;