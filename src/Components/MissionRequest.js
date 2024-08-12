import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const MissionRequest = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    phone: "",
    startDate: null,
    endDate: null,
    missionBudget: "", // Changed to string for input convenience
    purposeOfTravel: "",
    destination: "",
    departureTime: "",
    supervisorApproval: "",
  });
  const today = new Date().toISOString().split("T")[0]; // Get current date for min attribute of date inputs
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

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form fields
      if (!formData.startDate || !formData.endDate) {
        throw new Error("Please select start and end dates.");
      }

      // Convert missionBudget to a numeric value
      const numericBudget = parseFloat(
        formData.missionBudget.replace(/[^\d.-]/g, "")
      );

      const newMissionRequest = {
        ...formData,
        missionBudget: numericBudget, // Assign the numeric value
        status: "Pending",
        requestDate: new Date().toISOString().split("T")[0],
      };

      // Make POST request to backend API to create mission request
      const response = await axios.post(
        "http://hr-back-end.azurewebsites.net/mission-requests",
        newMissionRequest
      );

      // Handle success
      console.log("Mission request submitted:", response.data);

      // Reset form data and show success message
      setFormData({
        employeeId: "",
        phone: "",
        startDate: null,
        endDate: null,
        missionBudget: "",
        purposeOfTravel: "",
        destination: "",
        departureTime: "",
        supervisorApproval: "",
      });

      setShowSuccessMessage(true);
    } catch (error) {
      // Handle error
      console.error("Error submitting mission request:", error);
      setError("Failed to submit mission request. Please try again later.");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="w-full p-4 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
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
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Phone (Personal Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, "startDate")}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              placeholderText="Start Date"
              min={today}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleDateChange(date, "endDate")}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              placeholderText="End Date"
              min={formData.startDate || today}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Mission Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="missionBudget"
              value={formData.missionBudget}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Purpose of Travel <span className="text-red-500">*</span>
            </label>
            <textarea
              name="purposeOfTravel"
              value={formData.purposeOfTravel}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Departure Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Supervisor Approval <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supervisorApproval"
              value={formData.supervisorApproval}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
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
          <p className="text-green-500 mt-2">
            Mission request submitted successfully!
          </p>
        )}

        {/* Error message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default MissionRequest;
