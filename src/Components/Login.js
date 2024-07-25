import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [welcomeText, setWelcomeText] = useState("");
  const welcomeMessage = "Welcome to AVOCarbon LEAVE Management";

  useEffect(() => {
    // Simulate typewriter effect
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= welcomeMessage.length) {
        setWelcomeText(welcomeMessage.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: username,
          password: password,
        }
      );
      console.log("Response data:", response.data); // Log response data
      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const userRole = response.data.user.role;
        setRole(userRole); // Assuming setRole is defined somewhere to update state
        navigate(`/${getRedirectPath(userRole)}`);
      } else {
        console.log("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      console.log("Invalid credentials. Please try again.");
    }
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "EMPLOYEE":
        return "home";
      case "MANAGER":
        return "home-admin";
      case "HRMANAGER":
        return "home-rh";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-orange-500 p-4 sm:p-6 lg:p-8">
      <div className="background-svg">
        <div className="absolute top-4 left-4">
          <img
            src="/image.png"
            alt="AVOCarbon Group Logo"
            className="w-48 h-auto lg:w-64"
          />
        </div>
      </div>
      <div className="login-container">
        <div className="text-center text-orange-500 text-2xl font-bold mb-6">
          {welcomeText}
        </div>
        <h2 className="text-center text-2xl font-bold mb-6">Sign In</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              SIGN IN
            </button>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-gray-500 hover:text-orange-500"
                >
                  Forgot your password?{" "}
                  <span className="underline">Reset Password</span>
                </a>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8">
          <p className="text-center text-sm font-medium text-gray-700">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-orange-500 hover:text-orange-700"
            >
              Register here
            </a>
          </p>
        </div>
      </div>

      {/* Absolute positioned logo */}
      <div
        style={{
          position: "absolute",
          right: "16%",
          padding: "1rem",
          backgroundColor: "#f6f5fb",
          borderRadius: "100%",
        }}
      >
        <img
          src="/1267633.png"
          alt="Logo"
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>
  );
};

export default Login;
