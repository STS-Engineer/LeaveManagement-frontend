import React, { useState } from "react";
import axios from "axios";

const DocumentRequest = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    documentType: "",
    otherDocumentType: "",
    documentPurpose: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState("");

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

    const newDocumentRequest = {
      employee_id: formData.employeeId,
      document_type:
        formData.documentType === "other"
          ? formData.otherDocumentType
          : formData.documentType,
      additional_info: formData.documentPurpose,
    };

    try {
      await axios.post(
        "http://hr-back-end.azurewebsites.net/document-requests",
        newDocumentRequest
      );

      setFormData({
        employeeId: "",
        documentType: "",
        otherDocumentType: "",
        documentPurpose: "",
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      setError("Failed to submit document request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
              Type of Document <span className="text-red-500">*</span>
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">-- Select --</option>
              <option value="salary-certificate">Salary Certificate</option>
              <option value="work-certificate">Work Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {formData.documentType === "other" && (
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-2">
              <label className="block text-sm font-bold mb-2">
                Please specify
              </label>
              <input
                type="text"
                name="otherDocumentType"
                value={formData.otherDocumentType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full md:w-1/2 px-3 mb-2">
            <label className="block text-sm font-bold mb-2">
              Document Purpose
            </label>
            <input
              type="text"
              name="documentPurpose"
              value={formData.documentPurpose}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {showSuccessMessage && (
          <p className="text-green-500 mt-2">
            Document request submitted successfully!
          </p>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default DocumentRequest;
