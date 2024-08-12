import React, { useState, useEffect } from "react";
import axios from "axios";

const AuthAdmin = () => {
  const [authRequests, setAuthRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5); // Number of requests per page

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://hr-back-end.azurewebsites.net/authorization-requests?page=${currentPage}&limit=${requestsPerPage}`
        );
        setAuthRequests(response.data); // Set auth requests data
      } catch (error) {
        console.error("Error fetching authorization requests:", error);
      }
    };

    fetchRequests(); // Initial fetch
    const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentPage]);

  const handleStatusChange = (id, newStatus) => {
    // Optimistically update the UI
    const updatedRequests = authRequests.map((request) =>
      request.requestid === id ? { ...request, status: newStatus } : request
    );
    setAuthRequests(updatedRequests);

    // Make the server request
    axios
      .put(`http://hr-back-end.azurewebsites.net/authorization-requests/${id}`, {
        status: newStatus,
      })
      .then((response) => {
        const confirmedRequests = authRequests.map((request) =>
          request.requestid === id ? response.data : request
        );
        setAuthRequests(confirmedRequests);
      })
      .catch((error) => {
        console.error("Error updating authorization request:", error);
        // Revert the optimistic update if there was an error
        setAuthRequests(authRequests);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://hr-back-end.azurewebsites.net/authorization-requests/${id}`)
      .then(() => {
        setAuthRequests(
          authRequests.filter((request) => request.requestid !== id)
        );
      })
      .catch((error) =>
        console.error("Error deleting authorization request:", error)
      );
  };

  const toggleDetails = (id) => {
    setSelectedRequestId(selectedRequestId === id ? null : id);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col">
        {authRequests.length > 0 ? (
          authRequests.map((request) => (
            <div
              key={request.requestid}
              className="bg-white p-4 mb-4 rounded-md shadow-md cursor-pointer"
              onClick={() => toggleDetails(request.requestid)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">
                    {request.purposeofauthorization}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(request.authorizationdate).toLocaleDateString()}{" "}
                    from {request.departuretime} to {request.returntime}
                  </p>
                  {selectedRequestId === request.requestid && (
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          First Name & Last Name:
                        </span>{" "}
                        {request.firstname} {request.lastname}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Phone:</span>{" "}
                        {request.phone}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Department:</span>{" "}
                        {request.department}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Function:</span>{" "}
                        {request.function}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Status:</span>{" "}
                        {request.status}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(request.requestid, "Approved");
                    }}
                    className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${
                      request.status === "Approved"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={request.status === "Approved"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(request.requestid, "Rejected");
                    }}
                    className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ${
                      request.status === "Rejected"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={request.status === "Rejected"}
                  >
                    Reject
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(request.requestid);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>There are no authorization requests.</p>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuthAdmin;
