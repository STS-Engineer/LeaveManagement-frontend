import React from "react";
import { Link } from "react-router-dom";
import {
  BsHouseDoorFill,
  BsCalendarCheckFill,
  BsBriefcaseFill,
  BsShieldLockFill,
  BsFileEarmarkFill,
} from "react-icons/bs";

const Sidebar = () => {
  return (
    <div className="bg-white text-black h-screen w-64 md:w-48 lg:w-64 xl:w-64 flex flex-col shadow-lg rounded-xl">
      {/* Logo or Branding */}
      <div className="p-4 flex items-center justify-center md:justify-start lg:justify-center">
        <img src="image.png" alt="Logo" className="h-20 mb-5 mx-auto md:mx-0" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul>
          <li className="my-2">
            <Link
              to="/home" // Navigate to /home route
              className="flex items-center p-2 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
            >
              <BsHouseDoorFill className="mr-2" /> Home
            </Link>
          </li>
          <li className="my-2">
            <Link
              to="/my-leave"
              className="flex items-center p-2 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
            >
              <BsCalendarCheckFill className="mr-2" /> My Leave
            </Link>
          </li>
          <li className="my-2">
            <Link
              to="/my-mission"
              className="flex items-center p-2 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
            >
              <BsBriefcaseFill className="mr-2" /> My Mission
            </Link>
          </li>
          <li className="my-2">
            <Link
              to="/my-auth"
              className="flex items-center p-2 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
            >
              <BsShieldLockFill className="mr-2" /> My Authorization
            </Link>
          </li>
          <li className="my-2">
            <Link
              to="/my-docs"
              className="flex items-center p-2 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
            >
              <BsFileEarmarkFill className="mr-2" /> My Documents
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
