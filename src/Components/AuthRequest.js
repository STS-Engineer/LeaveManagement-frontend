import React, { useState } from "react";
import axios from "axios";

const AuthRequest = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    phone: "",
    authorizationDate: "",
    departureTime: "",
    returnTime: "",
    purposeOfAuthorization: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/authorization-requests",
        formData
      );

      setSubmitting(false);
      setShowSuccessMessage(true);
      setError(null);

      // Clear form data after submission
      setFormData({
        employeeId: "",
        phone: "",
        authorizationDate: "",
        departureTime: "",
        returnTime: "",
        purposeOfAuthorization: "",
      });
    } catch (error) {
      setError(
        error.response ? error.response.data.error : "Something went wrong!"
      );
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // Get current date for min attribute of date inputs

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Serial Number
              <span className="text-gray-500">
                {" "}
                (Employee ID, ID Number, M.At)
              </span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Phone (Personal Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Authorization Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="authorizationDate"
              value={formData.authorizationDate}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded"
              min={today}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Departure Time
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-2">
            <label className="block text-sm font-bold mb-2">Return Time</label>
            <input
              type="time"
              name="returnTime"
              value={formData.returnTime}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Purpose of Authorization <span className="text-red-500">*</span>
            </label>
            <textarea
              name="purposeOfAuthorization"
              value={formData.purposeOfAuthorization}
              onChange={handleChange}
              className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded"
              rows="4"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Apply"}
        </button>

        {/* Success message */}
        {showSuccessMessage && (
          <p className="mt-4 text-green-600">
            Authorization request submitted successfully!
          </p>
        )}

        {/* Error message */}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default AuthRequest;
