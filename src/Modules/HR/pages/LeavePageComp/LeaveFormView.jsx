import React from "react";
import { useEffect, useState } from "react";
import { Button, Select, Title } from "@mantine/core";
import {
  PaperPlaneRight,
  ArrowBendUpRight,
  XCircle,
  CheckCircle,
  FileArchive,
  FileText,
  Table,
  User,
  Tag,
  IdentificationCard,
  Building,
  Calendar,
  ClipboardText,
  FloppyDisk,
  UserList,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./LeaveFormView.css";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import { view_leave_form } from "../../../../routes/hr";

const LeaveFormView = () => {
  const { id } = useParams();
  const [fetchedformData, setfetchedformData] = useState(null);
  const [loading, setLoading] = useState(true);

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "Leave", path: "/hr/leave" },
    { title: "View Form", path: `/hr/leave/view/${id}` },
  ];

  useEffect(() => {
    const fetchfetchedformData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${view_leave_form}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setfetchedformData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setLoading(false);
      }
    };

    fetchfetchedformData();
  }, [id]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!fetchedformData) {
    return (
      <>
        <HrBreadcrumbs items={exampleItems} />
        <EmptyTable message="No view data found." />
      </>
    );
  }

  return (
    <>
      <HrBreadcrumbs items={exampleItems} />
      {/* //title  */}
      <Title
        order={2}
        style={{ fontWeight: "500", marginTop: "40px", marginLeft: "15px" }}
      >
        Leave Form Details
      </Title>

      <div className="leave_container">
        <Link
          to={`/hr/FormView/leaveform_track/${fetchedformData.file_id}`}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007bffcc", // Blue background, adjust color as needed
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            textAlign: "center",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          // Add hover effect
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bffcc")}
        >
          Track Status
        </Link>

        <form>
          {/* Section 1: Name and Designation */}
          <div className="grid-row two-columns">
            <div className="grid-col">
              <label className="input-label" htmlFor="name">
                Name
              </label>
              <div className="input-wrapper">
                <User size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={fetchedformData.name}
                  placeholder="Name"
                  className="input"
                  disabled
                />
              </div>
            </div>
            <div className="grid-col">
              <label className="input-label" htmlFor="designation">
                Designation
              </label>
              <div className="input-wrapper">
                <Tag size={20} />
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  placeholder="Designation"
                  value={fetchedformData.designation}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Section 2: Department, PF Number, Application Date */}
          <div className="grid-row three-columns">
            <div className="grid-col">
              <label className="input-label" htmlFor="departmentInfo">
                Department
              </label>
              <div className="input-wrapper">
                <Building size={20} />
                <input
                  type="text"
                  id="departmentInfo"
                  name="departmentInfo"
                  placeholder="Department Name"
                  value={fetchedformData.departmentInfo}
                  className="input"
                  disabled
                />
              </div>
            </div>
            <div className="grid-col">
              <label className="input-label" htmlFor="pfNo">
                PF Number
              </label>
              <div className="input-wrapper">
                <IdentificationCard size={20} />
                <input
                  type="number"
                  id="pfNo"
                  name="pfNo"
                  placeholder="XXXXXXXXXXXX"
                  value={fetchedformData.pfNo}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="grid-col">
              <label className="input-label" htmlFor="submissionDate">
                Application Date
              </label>
              <div className="input-wrapper center">
                <Calendar size={20} />
                <input
                  type="date"
                  id="submissionDate"
                  name="submissionDate"
                  value={fetchedformData.submissionDate}
                  className="input center"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Section 3: Nature of Leave, Leave Start Date, Leave End Date
          <div className="grid-row three-columns">
            <div className="grid-col">
              <label className="input-label" htmlFor="natureOfLeave">
                Nature of Leave
              </label>
              <div className="input-wrapper">
                <Building size={20} />
                <input
                  type="text"
                  id="natureOfLeave"
                  name="natureOfLeave"
                  value={fetchedformData.natureOfLeave}
                  className="input"
                  disabled
                />
              </div>
            </div>
            <div className="grid-col">
              <label className="input-label" htmlFor="leaveStartDate">
                Leave Start Date
              </label>
              <div className="input-wrapper">
                <Calendar size={20} />
                <input
                  type="date"
                  id="leaveStartDate"
                  name="leaveStartDate"
                  value={fetchedformData.leaveStartDate}
                  className="input"
                  disabled
                />
              </div>
            </div>
            <div className="grid-col">
              <label className="input-label" htmlFor="leaveEndDate">
                Leave End Date
              </label>
              <div className="input-wrapper">
                <Calendar size={20} />
                <input
                  type="date"
                  id="leaveEndDate"
                  name="leaveEndDate"
                  value={fetchedformData.leaveEndDate}
                  className="input"
                  disabled
                  required
                />
              </div>
            </div>
          </div> */}

          <div className="grid-container">
            {fetchedformData.natureOfLeave?.map((item, index) => (
              <div className="grid-item" key={index}>
                {/* Single Leave Component */}
                <div className="leave-component-row">
                  {/* Leave Type and Available */}
                  <div className="leave-type-section">
                    <span className="leave-type">{item.leavetype}</span>
                    <span className="available-details">
                      Available:{" "}
                      <span className="available-count">
                        {item.availableCount}
                      </span>
                    </span>
                  </div>

                  {/* Start Date */}
                  <div className="leave-detail">
                    <label
                      className="detail-label"
                      htmlFor={`startDate-${index}`}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id={`startDate-${index}`}
                      name="startDate"
                      value={item.startDate}
                      onChange={(e) =>
                        handleLeaveBalanceChange(
                          index,
                          "startDate",
                          e.target.value,
                        )
                      }
                      className="detail-input"
                      // required
                    />
                  </div>

                  {/* End Date */}
                  <div className="leave-detail">
                    <label
                      className="detail-label"
                      htmlFor={`endDate-${index}`}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id={`endDate-${index}`}
                      name="endDate"
                      value={item.endDate}
                      onChange={(e) =>
                        handleLeaveBalanceChange(
                          index,
                          "endDate",
                          e.target.value,
                        )
                      }
                      className="detail-input"
                      // required
                    />
                  </div>

                  {/* Duration */}
                  <div className="leave-detail">
                    <label
                      className="detail-label"
                      htmlFor={`duration-${index}`}
                    >
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      id={`duration-${index}`}
                      name="duration"
                      value={item.duration}
                      onChange={(e) =>
                        handleLeaveBalanceChange(
                          index,
                          "duration",
                          e.target.value,
                        )
                      }
                      className="detail-input"
                      // required
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Extra Row for Last Row's Components */}
            {/* {leaveBalances.length % 2 !== 0 && ( */}
            <div className="grid-item last-row">
              {/* Leave Start Date */}
              <div className="leave-detail">
                <label className="detail-label" htmlFor="leaveStartDate">
                  Leave Start Date
                </label>
                <div className="input-wrapper">
                  {/* <Calendar size={20} /> */}
                  <input
                    type="date"
                    id="leaveStartDate"
                    name="leaveStartDate"
                    value={fetchedformData.leaveStartDate}
                    // onChange={handleChange}
                    className="detail-input"
                    required
                  />
                </div>
              </div>

              {/* Leave End Date */}
              <div className="leave-detail">
                <label className="detail-label" htmlFor="leaveEndDate">
                  Leave End Date
                </label>
                <div className="input-wrapper">
                  {/* <Calendar size={20} /> */}
                  <input
                    type="date"
                    id="leaveEndDate"
                    name="leaveEndDate"
                    value={fetchedformData.leaveEndDate}
                    // onChange={handleChange}
                    className="detail-input"
                    required
                  />
                </div>
              </div>
            </div>
            {/* )} */}
          </div>

          {/* Section 4: Purpose of Leave, Address during Leave */}
          <div className="grid-row two-columns">
            <div className="grid-col">
              <label className="input-label" htmlFor="purposeOfLeave">
                Purpose
              </label>
              <div className="input-wrapper">
                <ClipboardText size={20} />
                <input
                  type="text"
                  id="purposeOfLeave"
                  name="purposeOfLeave"
                  placeholder="Purpose of Leave"
                  value={fetchedformData.purposeOfLeave}
                  className="input"
                  disabled
                />
              </div>
            </div>
            <div className="grid-col">
              <label className="input-label" htmlFor="addressDuringLeave">
                Address during Leave
              </label>
              <div className="input-wrapper">
                <UserList size={20} />
                <input
                  type="text"
                  id="addressDuringLeave"
                  name="addressDuringLeave"
                  placeholder="Full Address"
                  value={fetchedformData.addressDuringLeave}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Section 5: Academic and Administrative Responsibility */}
          <div className="grid-row two-columns">
            <div className="grid-col">
              <label className="input-label" htmlFor="academicResponsibility">
                Academic Responsibility
              </label>
              <div className="input-wrapper">
                <Tag size={20} />
                <input
                  type="text"
                  id="academicResponsibility"
                  name="academicResponsibility"
                  placeholder="Enter the name"
                  value={fetchedformData.academicResponsibility}
                  className="input"
                  disabled
                />
              </div>
            </div>
            <div className="grid-col">
              <label
                className="input-label"
                htmlFor="addministrativeResponsibiltyAssigned"
              >
                Administrative Responsibility
              </label>
              <div className="input-wrapper">
                <Tag size={20} />
                <input
                  type="text"
                  id="addministrativeResponsibiltyAssigned"
                  name="addministrativeResponsibiltyAssigned"
                  placeholder="Enter the name"
                  value={fetchedformData.addministrativeResponsibiltyAssigned}
                  className="input"
                  disabled
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LeaveFormView;
