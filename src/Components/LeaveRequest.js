import React, { useState } from "react";
import axios from "axios";

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    phone: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    justification: "",
    justificationFile: null,
    otherLeaveType: "",
    requestDate: new Date().toISOString().split("T")[0], // Default to current date
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    const newLeaveRequest = new FormData();
    Object.keys(formData).forEach((key) => {
      newLeaveRequest.append(key, formData[key]);
    });

    // If "Other" leave type is selected, use the value from the text input
    if (formData.leaveType === "Other") {
      newLeaveRequest.set("leaveType", formData.otherLeaveType);
    }

    try {
      const response = await axios.post(
        "https://hr-back-end.azurewebsites.net/leave-requests",
        newLeaveRequest,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitting(false);
      setShowSuccessMessage(true);
      setError(null);

      // Clear form data after submission
      setFormData({
        employeeId: "",
        phone: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        justification: "",
        justificationFile: null,
        otherLeaveType: "",
        requestDate: new Date().toISOString().split("T")[0], // Reset requestDate to current date
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
          <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
            <label className="block text-sm font-bold mb-2">
              Type of Leave <span className="text-red-500">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              required
            >
              <option value="">-- Select --</option>
              <option value="Wedding">Wedding</option>
              <option value="Business">Business</option>
              <option value="Injury">Injury</option>
              <option value="Sick">Sick</option>
              <option value="Maternity">Maternity</option>
              <option value="Funeral">Funeral (Ghrama) / Explet</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Compensatory">Compensatory</option>
              <option value="Without Pay">Without Pay</option>
              <option value="Seniority">Seniority</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {formData.leaveType === "Other" && (
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
              <label className="block text-sm font-bold mb-2">
                Please specify the type of leave{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="otherLeaveType"
                value={formData.otherLeaveType}
                onChange={handleChange}
                className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
            <label className="block text-sm font-bold mb-2">
              Start Date of Leave <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              min={today}
              required
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
            <label className="block text-sm font-bold mb-2">
              End Date of Leave <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
              min={formData.startDate || today}
              required
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
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
              Justification <span className="text-red-500">*</span>
            </label>
            <textarea
              name="justification"
              value={formData.justification}
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
              Upload Justification File
            </label>
            <input
              type="file"
              name="justificationFile"
              onChange={handleChange}
              className="w-full p-2 pl-10 text-sm text-gray-700 border border-gray-300 rounded"
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
            Leave request submitted successfully!
          </p>
        )}

        {/* Error message */}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default LeaveRequest;
