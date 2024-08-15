import React, { useState, useEffect } from "react";
import { AiOutlineUpload } from "react-icons/ai"; // Icon for file upload

const DashboardAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5); // Number of requests per page

  useEffect(() => {
    // Fetch leave requests periodically
    const fetchRequests = () => {
      fetch(
<<<<<<< HEAD
        `http://localhost:3000/leave-requests?page=${currentPage}&limit=${requestsPerPage}`
=======
        `https://hr-back-end.azurewebsites.net/leave-requests?page=${currentPage}&limit=${requestsPerPage}`
>>>>>>> 26d20a5bdaf65b78c73a1cefaa9fdd9e17395b58
      )
        .then((response) => response.json())
        .then((data) => setLeaveRequests(data))
        .catch((error) =>
          console.error("Error fetching leave requests:", error)
        );
    };

    fetchRequests(); // Initial fetch
    const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentPage]);

  const handleStatusChange = (id, newStatus) => {
    // Optimistically update the UI
    const updatedRequests = leaveRequests.map((request) =>
      request.requestid === id ? { ...request, status: newStatus } : request
    );
    setLeaveRequests(updatedRequests);

    // Make the server request
<<<<<<< HEAD
    fetch(`http://localhost:3000/leave-requests/${id}`, {
=======
    fetch(`https://hr-back-end.azurewebsites.net/leave-requests/${id}`, {
>>>>>>> 26d20a5bdaf65b78c73a1cefaa9fdd9e17395b58
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((updatedRequest) => {
        // Ensure the response contains the correct fields
        if (updatedRequest && updatedRequest.requestid) {
          const confirmedRequests = leaveRequests.map((request) =>
            request.requestid === id ? updatedRequest : request
          );
          setLeaveRequests(confirmedRequests);
        } else {
          console.error("Unexpected response format:", updatedRequest);
        }
      })
      .catch((error) => {
        console.error("Error updating leave request:", error);
        // Revert the optimistic update if there was an error
        setLeaveRequests(leaveRequests);
      });
  };

  const handleDelete = (id) => {
<<<<<<< HEAD
    fetch(`http://localhost:3000/leave-requests/${id}`, {
=======
    fetch(`https://hr-back-end.azurewebsites.net/leave-requests/${id}`, {
>>>>>>> 26d20a5bdaf65b78c73a1cefaa9fdd9e17395b58
      method: "DELETE",
    })
      .then(() => {
        setLeaveRequests(
          leaveRequests.filter((request) => request.requestid !== id)
        );
      })
      .catch((error) => console.error("Error deleting leave request:", error));
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
        {leaveRequests.length > 0 ? (
          leaveRequests.map((request) => (
            <div
              key={request.requestid}
              className="bg-white p-4 mb-4 rounded-md shadow-md cursor-pointer"
              onClick={() => toggleDetails(request.requestid)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{request.leavetype}</h3>
                  <p className="text-gray-600">
                    {request.startdate.slice(0, 10)} to{" "}
                    {request.enddate.slice(0, 10)}
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
                        <span className="font-semibold">Justification:</span>{" "}
                        {request.justification}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          Justification File:
                        </span>{" "}
                        {request.justificationfile && (
                          <a
<<<<<<< HEAD
                            href={`http://localhost:3000/uploads/${request.justificationfile}`}
=======
                            href={`https://hr-back-end.azurewebsites.net/uploads/${request.justificationfile}`}
>>>>>>> 26d20a5bdaf65b78c73a1cefaa9fdd9e17395b58
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            {request.justificationfile}
                          </a>
                        )}
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
          <p>There are no leave requests.</p>
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

export default DashboardAdmin;
