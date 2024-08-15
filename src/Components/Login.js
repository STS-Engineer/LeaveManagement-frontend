import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [userName, setUserName] = useState(""); // State to store user's first and last name
  const navigate = useNavigate();
  const [welcomeText, setWelcomeText] = useState("");
  const welcomeMessage = "Welcome to AVOCarbon LEAVE Management";

  useEffect(() => {
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
    setErrorMessage(""); // Clear previous error message
    setShowError(false); // Hide the previous error message if visible

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: username,
        password: password,
      });

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const userRole = response.data.user.role;
        setRole(userRole);
        setUserName(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        ); // Set user's first and last name
        navigate(`/${getRedirectPath(userRole)}`);
      } else {
        setErrorMessage("Invalid Credentials. Please try again.");
        setShowError(true); // Show the error message
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Password Incorrect. Please try again.");
      setShowError(true); // Show the error message
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 1500);

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [showError]);

  const getRedirectPath = (role) => {
    switch (role) {
      case "EMPLOYEE":
        return "home";
      case "MANAGER":
        return "home-admin";
      case "HRMANAGER":
        return "home-rh";
      case "PLANT_MANAGER":
        return "home-admin";
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
        {showError && (
          <div
            className={`transition-opacity duration-200 ease-in-out ${
              showError ? "opacity-100" : "opacity-0"
            } bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4`}
            role="alert"
          >
            <p>{errorMessage}</p>
          </div>
        )}
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
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm">
                <a
                  href="/reset-password"
                  className="font-medium text-gray-500 hover:text-orange-500"
                >
                  Forgot your password?{" "}
                  <span className="underline">Reset Password</span>
                </a>
              </div>
            </div>
          </div>
        </form>

        {userName && ( // Conditionally render the welcome message
          <div className="mt-8 text-center text-lg font-bold text-green-600">
            Welcome, {userName}!
          </div>
        )}

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
