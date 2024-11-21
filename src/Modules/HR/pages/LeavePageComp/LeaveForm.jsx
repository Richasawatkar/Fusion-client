import React from "react";
import { useEffect, useState } from "react";
import { Button, Group, NumberInput, Select, Text } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
  PaperPlaneRight,
  CheckCircle,
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
import {
  search_employee,
  get_my_details,
  submit_leave_form,
  get_leave_balance,
} from "../../../../routes/hr";
import "./LeaveForm.css";
import { useNavigate, useParams } from "react-router-dom";

const LeaveForm = () => {
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const [verifiedReceiver, setVerifiedReceiver] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  // State for leave types and leave balances
  const [leaveData, setLeaveData] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [formValues, setFormValues] = useState([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        // Fetch leave balances data
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const leaveBalanceResponse = await fetch(`${get_leave_balance}/${id}`, {
          method: "GET",
          headers: { Authorization: `Token ${token}` },
        });

        if (!leaveBalanceResponse.ok) {
          alert("Failed to fetch leave balances. Please try again later.");
          throw new Error("Network response was not ok");
        }

        const leaveBalanceData = await leaveBalanceResponse.json();
        console.log(leaveBalanceData);

        // Map the leave balance data to the structure
        const mappedData = Object.keys(leaveBalanceData).map((leavetype) => ({
          leavetype: leavetype, // Name of the leave type
          availableCount: leaveBalanceData[leavetype], // Available count for that leave type
          startDate: "",
          endDate: "",
          duration: 0,
        }));

        // Set the mapped data to the state
        setLeaveBalances(mappedData);
        console.log(leaveBalances);
        setFormValues(mappedData); // Optional: If you want to update formValues too
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Fetch user details
  useEffect(() => {
    const fetchMyDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authentication token found!");
          return;
        }

        const response = await fetch(get_my_details, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          alert("Failed to fetch user details. Please try again later.");
          throw new Error("Network response was not ok");
        }

        const fetchedData = await response.json();
        dispatch(updateForm({ name: "name", value: fetchedData.username }));
        dispatch(
          updateForm({ name: "designation", value: fetchedData.designation }),
        );
        console.log(fetchedData);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchMyDetails();
  }, []);

  const handleCheck = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(
        `${search_employee}?search=${formData.username_reciever}`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      if (!response.ok) {
        alert("Receiver not found. Please check the username and try again.");
        throw new Error("Network response was not ok");
      }

      const fetchedReceiverData = await response.json();
      dispatch(
        updateForm({
          name: "designation_reciever",
          value: fetchedReceiverData.designation,
        }),
      );
      setVerifiedReceiver(true);
      alert("Receiver verified successfully!");
    } catch (error) {
      console.error("Failed to fetch receiver data:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(updateForm({ name, value }));
  };

  const handleLeaveBalanceChange = (index, field, value) => {
    setLeaveBalances((prevBalances) => {
      const newBalances = [...prevBalances];
      newBalances[index] = { ...newBalances[index], [field]: value };
      return newBalances;
    });
  };

  const handleSelectChange = (value) => {
    dispatch(updateForm({ name: "natureOfLeave", value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!verifiedReceiver) {
      alert("Please verify the receiver before submitting the form.");
      return;
    }

    // Filter leave types with non-empty startDate, endDate, and duration
    const filteredLeaves = leaveBalances.filter(
      (leave) => leave.startDate && leave.endDate && leave.duration,
    );

    const submission = {
      ...formData,
      natureOfLeave: filteredLeaves,
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(submit_leave_form, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(submission),
      });
      console.log(submission);

      if (!response.ok) {
        alert("Failed to submit form. Please try again later.");
        throw new Error("Network response was not ok");
      }

      alert("Form submitted successfully!");
      dispatch(resetForm());
      navigate("/hr/leave/leaverequests");
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <div className="Leave_container">
      <form onSubmit={handleSubmit}>
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
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                className="input"
                required
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
                value={formData.designation}
                onChange={handleChange}
                className="input"
                required
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
                value={formData.departmentInfo}
                onChange={handleChange}
                className="input"
                required
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
                value={formData.pfNo}
                onChange={handleChange}
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
                value={formData.submissionDate}
                onChange={handleChange}
                className="input center"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid-container">
          {leaveBalances?.map((item, index) => (
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
                  <label className="detail-label" htmlFor={`endDate-${index}`}>
                    End Date
                  </label>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    name="endDate"
                    value={item.endDate}
                    onChange={(e) =>
                      handleLeaveBalanceChange(index, "endDate", e.target.value)
                    }
                    className="detail-input"
                    // required
                  />
                </div>

                {/* Duration */}
                <div className="leave-detail">
                  <label className="detail-label" htmlFor={`duration-${index}`}>
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
                <Calendar size={20} />
                <input
                  type="date"
                  id="leaveStartDate"
                  name="leaveStartDate"
                  value={formData.leaveStartDate}
                  onChange={handleChange}
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
                <Calendar size={20} />
                <input
                  type="date"
                  id="leaveEndDate"
                  name="leaveEndDate"
                  value={formData.leaveEndDate}
                  onChange={handleChange}
                  className="detail-input"
                  required
                />
              </div>
            </div>
          </div>
          {/* )} */}
        </div>

        {/* Section 4: Purpose of Leave */}
        <div className="grid-row">
          <div className="purpose">
            <label className="input-label" htmlFor="purposeOfLeave">
              Purpose
            </label>
            <div className="input-wrapper">
              <ClipboardText size={20} />
              <input
                type="text"
                id="purposeOfLeave"
                name="purposeOfLeave"
                placeholder="purpose Of Leave"
                value={formData.purposeOfLeave}
                onChange={handleChange}
                className="input"
                aria-rowcount={2}
                required
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="addressDuringLeave">
              Adress during Leave
            </label>
            <div className="input-wrapper">
              <UserList size={20} />
              <input
                type="text"
                id="addressDuringLeave"
                name="addressDuringLeave"
                placeholder="Full Address"
                value={formData.addressDuringLeave}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 5: Academic and Administrative Responsibility */}
        <div className="grid-row">
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
                value={formData.academicResponsibility}
                onChange={handleChange}
                className="input"
                required
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
                value={formData.addministrativeResponsibiltyAssigned}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="input-wrapper">
            <User size={20} />
            <input
              type="text"
              name="username_reciever"
              placeholder="Receiver's Username"
              value={formData.username_reciever}
              onChange={handleChange}
              className="username-input"
              required
            />
          </div>
          <div className="input-wrapper">
            <Tag size={20} />
            <input
              type="text"
              name="designation_reciever"
              placeholder="Designation"
              value={formData.designation_reciever}
              className="designation-input"
              required
              disabled
            />
          </div>
          <Button
            lefticon={<CheckCircle size={25} />}
            style={{ marginLeft: "50px", paddingRight: "15px" }}
            className="button"
            onClick={handleCheck}
          >
            <CheckCircle size={18} /> &nbsp; Check
          </Button>
          <Button
            type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              width: "150px",
              paddingRight: "15px",
              borderRadius: "5px",
            }}
            className="button"
            // disabled={!verifiedReceiver}
          >
            <PaperPlaneRight size={20} /> &nbsp; Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
