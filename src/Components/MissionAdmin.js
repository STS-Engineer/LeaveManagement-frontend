import React, { useState, useEffect } from "react";

const MissionAdmin = () => {
  const [missionRequests, setMissionRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5); // Number of requests per page

  useEffect(() => {
    const fetchRequests = () => {
      fetch(
        `http://localhost:5000/api/mission-requests?page=${currentPage}&limit=${requestsPerPage}`
      )
        .then((response) => response.json())
        .then((data) => setMissionRequests(data))
        .catch((error) =>
          console.error("Error fetching mission requests:", error)
        );
    };

    fetchRequests(); // Initial fetch
    const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [currentPage]);

  const handleStatusChange = (id, newStatus) => {
    // Optimistically update the UI
    const updatedRequests = missionRequests.map((request) =>
      request.requestid === id ? { ...request, status: newStatus } : request
    );
    setMissionRequests(updatedRequests);

    // Make the server request
    fetch(`http://localhost:5000/api/mission-requests/${id}`, {
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
          const confirmedRequests = missionRequests.map((request) =>
            request.requestid === id ? updatedRequest : request
          );
          setMissionRequests(confirmedRequests);
        } else {
          console.error("Unexpected response format:", updatedRequest);
        }
      })
      .catch((error) => {
        console.error("Error updating mission request:", error);
        // Revert the optimistic update if there was an error
        setMissionRequests(missionRequests);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/mission-requests/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setMissionRequests(
          missionRequests.filter((request) => request.requestid !== id)
        );
      })
      .catch((error) =>
        console.error("Error deleting mission request:", error)
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
        {missionRequests.length > 0 ? (
          missionRequests.map((request) => (
            <div
              key={request.requestid}
              className="bg-white p-4 mb-4 rounded-md shadow-md cursor-pointer"
              onClick={() => toggleDetails(request.requestid)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">
                    {request.purposeoftravel}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(request.startdate).toLocaleDateString()} to{" "}
                    {new Date(request.enddate).toLocaleDateString()}
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
                        <span className="font-semibold">Destination:</span>{" "}
                        {request.destination}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Mission Budget:</span>{" "}
                        {request.missionbudget} euro
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Departure Time:</span>{" "}
                        {request.departuretime}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">
                          Supervisor Approval:
                        </span>{" "}
                        {request.supervisorapproval}
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
          <p>There are no mission requests.</p>
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

export default MissionAdmin;
