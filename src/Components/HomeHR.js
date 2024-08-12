import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import TopBarhr from "./TopBarHR";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const HomeHR = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [filter, setFilter] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const leaveRequestsResponse = await axios.get(
          "http://hr-back-end.azurewebsites.net/leave-requests"
        );
        const missionRequestsResponse = await axios.get(
          "http://hr-back-end.azurewebsites.net/mission-requests"
        );
        const authorizationRequestsResponse = await axios.get(
          "http://hr-back-end.azurewebsites.net/authorization-requests"
        );

        console.log("Leave Requests:", leaveRequestsResponse.data);
        console.log("Mission Requests:", missionRequestsResponse.data);
        console.log(
          "Authorization Requests:",
          authorizationRequestsResponse.data
        );

        const leaveRequests = leaveRequestsResponse.data.map((req) => ({
          id: req.requestid,
          employeeId: req.employeeid,
          type: "Leave",
          leaveType: req.leavetype, // Assuming 'typeofleave' is the key for type of leave
          startDate: req.startdate,
          endDate: req.enddate,
          status: req.status,
          firstName: req.firstname,
          lastName: req.lastname,
          function: req.function,
          department: req.department,
        }));

        const missionRequests = missionRequestsResponse.data.map((req) => ({
          id: req.requestid,
          employeeId: req.employeeid,
          type: "Mission",
          startDate: req.startdate,
          endDate: req.enddate,
          status: req.status,
          firstName: req.firstname,
          lastName: req.lastname,
          function: req.function,
          department: req.department,
        }));

        const authorizationRequests = authorizationRequestsResponse.data.map(
          (req) => ({
            id: req.requestid,
            employeeId: req.employeeid,
            type: "Authorization",
            startDate: req.authorization_date,
            status: req.status,
            firstName: req.firstname,
            lastName: req.lastname,
            function: req.function,
            department: req.department,
          })
        );

        const combinedRequests = [
          ...leaveRequests,
          ...missionRequests,
          ...authorizationRequests,
        ];

        setRequests(combinedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // duration in days
    return duration;
  };

  const filteredRequests = requests.filter((req) => {
    if (req.status !== "Approved") return false;
    if (filter !== "All" && req.type !== filter) return false;
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      const startDateObj = new Date(req.startDate);
      const endDateObj = new Date(req.endDate);
      if (filterDateObj < startDateObj || filterDateObj > endDateObj)
        return false;
    }
    return true;
  });

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Requests", 14, 16);
    doc.autoTable({
      head: [
        [
          "EmployeeID",
          "First Name",
          "Last Name",
          "Type of Request",
          "Type of Leave",
          "Start Date",
          "End Date",
          "Duration",
        ],
      ],
      body: filteredRequests.map((req) => [
        req.employeeId,
        req.firstName || "", // Ensure fields exist
        req.lastName || "",
        req.type || "",
        req.type === "Leave" ? req.typeOfLeave || "" : "-", // Type of leave or "-"
        formatDate(req.startDate) || "",
        formatDate(req.endDate) || "",
        calculateDuration(req.startDate, req.endDate) + " days" || "",
      ]),
    });
    doc.save("employeerequests.pdf");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRequests.map((req) => ({
        EmployeeID: req.employeeId || "",
        "First Name": req.firstName || "",
        "Last Name": req.lastName || "",
        "Type of Request": req.type || "",
        "Type of Leave": req.type === "Leave" ? req.leaveType || "" : "-",
        "Start Date": formatDate(req.startDate) || "",
        "End Date": formatDate(req.endDate) || "",
        Duration: calculateDuration(req.startDate, req.endDate) + " days" || "",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");
    XLSX.writeFile(workbook, "employeerequests.xlsx");
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <TopBarhr />
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-l font-bold">Employee Requests</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadExcel}
                className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center mr-2"
              >
                <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                Export Excel
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
              >
                <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label>Filter by Type: </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border p-2"
            >
              <option value="All">All</option>
              <option value="Leave">Leave</option>
              <option value="Mission">Mission</option>
              <option value="Authorization">Authorization</option>
            </select>

            <label className="ml-4">Filter by Date: </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border p-2"
            />
          </div>

          {currentRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    {[
                      "Employee ID",
                      "First Name",
                      "Last Name",
                      "Type of Request",
                      "Type of Leave",
                      "Start Date",
                      "End Date",
                      "Duration",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 text-left bg-gray-100 border-b border-gray-200"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{request.employeeId || ""}</td>
                      <td className="px-4 py-2">{request.firstName || ""}</td>
                      <td className="px-4 py-2">{request.lastName || ""}</td>
                      <td className="px-4 py-2">{request.type || ""}</td>
                      <td className="px-4 py-2">
                        {request.type === "Leave"
                          ? request.typeOfLeave || ""
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {request.startDate ? formatDate(request.startDate) : ""}
                      </td>
                      <td className="px-4 py-2">
                        {request.endDate ? formatDate(request.endDate) : ""}
                      </td>
                      <td className="px-4 py-2">
                        {request.startDate && request.endDate
                          ? calculateDuration(
                              request.startDate,
                              request.endDate
                            ) + " days"
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-center space-x-2">
                {Array.from({
                  length: Math.ceil(filteredRequests.length / requestsPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 border ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>No approved requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeHR;
