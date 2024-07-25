import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TopBarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Perform any logout tokens
    navigate("/login");
  };

  const getTitle = () => {
    if (location.pathname === "/admin-dashboard") return "Leave Management";
    if (location.pathname === "/mission-management")
      return "Mission Management";
    if (location.pathname === "/home-admin") return "Home";
    return "Dashboard";
  };

  return (
    <div className="bg-orange-400 p-4 flex justify-between items-center text-white">
      <div>{getTitle()}</div>
      <div className="flex items-center space-x-4">
        {/* Add admin-specific functionalities here */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <span>Manager</span> {/* Change to Admin */}
          <img
            src="/avatar.jpg"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-white text-orange-600 rounded-md hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default TopBarAdmin;
