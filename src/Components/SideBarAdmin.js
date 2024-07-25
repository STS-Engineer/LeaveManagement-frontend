import React from "react";
import { Link } from "react-router-dom";
import {
  BsHouseDoorFill,
  BsCalendarCheckFill,
  BsBriefcaseFill,
  BsShieldLockFill,
} from "react-icons/bs";

const SideBarAdmin = () => {
  return (
    <div className="bg-white text-black h-screen w-64 sm:w-48 lg:w-64 flex flex-col shadow-lg rounded-xl sm:rounded-lg lg:rounded-xl">
      {/* Logo or Branding */}
      <div className="p-4 flex items-center justify-center sm:justify-start lg:justify-center">
        <img src="image.png" alt="Logo" className="h-20 mb-5 mx-auto sm:mx-0" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul>
          <li className="my-2">
            <Link
              to="/home-admin" // Navigate to /home route
              className="flex items-center p-2 text-gray-600 hover:bg-orange-500 hover:text-white rounded-md transition-colors duration-200"
            >
              <BsHouseDoorFill className="mr-2" /> HomeAdmin
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBarAdmin;
