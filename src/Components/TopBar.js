import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Perform any logout tokens
    navigate("/login");
  };

  const getTitle = () => {
    if (location.pathname === "/leave-request") return "Leave Request";
    if (location.pathname === "/home") return "Home";
    if (location.pathname === "/mission-request") return "Mission Request";
    if (location.pathname === "/auth-request") return "Authorization Request";
    return "Dashboard";
  };
  return (
    <div className="bg-orange-400 p-4 flex justify-between items-center text-white">
      <div>{getTitle()}</div>
      <div className="flex items-center space-x-4">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLogout}
        >
          <span>Employee</span>
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

export default TopBar;
