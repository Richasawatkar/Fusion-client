import React, { useEffect, useState } from "react";
import { Button, Select, Title } from "@mantine/core";
import {
  PaperPlaneRight,
  ArrowBendUpRight,
  CheckCircle,
  FileText,
  User,
  Tag,
  IdentificationCard,
  Building,
  Calendar,
  ClipboardText,
  FloppyDisk,
  UserList,
  PencilSimpleLine,
  Prohibit,
  NavigationArrow,
  TrayArrowDown,
  UploadSimple,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./LeaveFormView.css";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../components/Loading";
import { EmptyTable } from "../../components/tables/EmptyTable";
import {
  view_leave_form,
  get_form_id,
  leave_edit_handle,
  search_employee,
  leave_file_handle,
} from "../../../../routes/hr";

const LeaveFilehandle = () => {
  const { id } = useParams();
  const [fetchedformData, setfetchedformData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form_id, setForm_id] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [verifiedReceiver, setVerifiedReceiver] = useState(false);
  const [username_reciever, setUsername_reciever] = useState("");
  const [designation_reciever, setDesignation_reciever] = useState("");
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const [leaveBalances, setLeaveBalances] = useState([]);

  //   get archive from query params
  const [archive, setArchive] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const archiveParam = urlParams.get("archive");
    if (archiveParam === "true") {
      setArchive(true);
    }
  }, []);

  const handleChangeusername_reciever = (e) => {
    setUsername_reciever(e.target.value);
  };

  const handleremark = (e) => {
    setRemark(e.target.value);
  };
  const handleCheck = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        return;
      }

      const response = await fetch(
        `${search_employee}?search=${username_reciever}`,
        {
          headers: { Authorization: `Token ${token}` },
        },
      );

      if (!response.ok) {
        alert("Receiver not found. Please check the username and try again.");
        throw new Error("Network response was not ok");
      }

      const fetchedReceiverData = await response.json();

      setDesignation_reciever(fetchedReceiverData.designation);

      setVerifiedReceiver(true);
      alert("Receiver verified successfully!");
    } catch (error) {
      console.error("Failed to fetch receiver data:", error);
    }
  };

  const exampleItems = [
    { title: "Home", path: "/dashboard" },
    { title: "Human Resources", path: "/hr" },
    { title: "Leave", path: "/hr/leave" },
    { title: "File Handle", path: `/hr/leave/file_handler/${id}` },
  ];

  useEffect(() => {
    const fetchFormData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found!");
        setLoading(false);
        return;
      }

      try {
        const response1 = await fetch(`${get_form_id}/${id}`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response1.ok) {
          throw new Error("Network response was not ok");
        }

        const data1 = await response1.json();
        setForm_id(data1.form_id);

        const response = await fetch(`${view_leave_form}/${data1.form_id}`, {
          headers: { Authorization: `Token ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let data = await response.json();

        setfetchedformData(data);
        setLeaveBalances(data.natureOfLeave || []); // Ensure leaveBalances is set correctly
        console.log(data);
        console.log(fetchedformData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setfetchedformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleLeaveBalanceChange = (index, field, value) => {
  //   setLeaveBalances((prevBalances) => {
  //     const newBalances = [...prevBalances];
  //     newBalances[index] = { ...newBalances[index], [field]: value };
  //     return newBalances;
  //   });
  // };

  // const handleLeaveBalanceChange = (index, field, value) => {
  //   setLeaveBalances((prevBalances) => {
  //     const newBalances = [...prevBalances];
  //     newBalances[index] = { ...newBalances[index], [field]: value };
  //     setfetchedformData((prevData) => ({
  //       ...prevData,
  //       natureOfLeave: newBalances,
  //     }));
  //     console.log(newBalances);
  //     return newBalances;
  //   });
  // };

  const handleLeaveBalanceChange = (index, field, value) => {
    const newBalances = leaveBalances.map((balance, i) =>
      i === index ? { ...balance, [field]: value } : balance,
    ); // Update the state
    setLeaveBalances(newBalances);
    setfetchedformData((prevData) => ({
      ...prevData,
      natureOfLeave: newBalances,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = (e, action) => {
    e.preventDefault();

    if (!verifiedReceiver) {
      if (action === "0" || action === "1") {
        alert("Please verify the receiver before proceeding.");
        return;
      }
    }

    //
    // setLoading(true);
    const submissionData = {
      form_id: form_id,
      action: action,
      remark: remark,
      username_receiver: username_reciever,
      designation_receiver: designation_reciever,
      submissionDate: fetchedformData.submissionDate,
      departmentInfo: fetchedformData.departmentInfo,
      pfNo: fetchedformData.pfNo,
      // natureOfLeave: fetchedformData.natureOfLeave,
      natureOfLeave: leaveBalances,
      leaveStartDate: fetchedformData.leaveStartDate,
      leaveEndDate: fetchedformData.leaveEndDate,
      purposeOfLeave: fetchedformData.purposeOfLeave,
      addressDuringLeave: fetchedformData.addressDuringLeave,
      academicResponsibility: fetchedformData.academicResponsibility,
      addministrativeResponsibiltyAssigned:
        fetchedformData.addministrativeResponsibiltyAssigned,
      // username_receiver: username_reciever,
      designation_reciever: designation_reciever,
    };

    console.log(submissionData);
    // send data to the server
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No authentication token found!");
      return;
    }

    const senddata = async () => {
      try {
        const response = await fetch(`${leave_edit_handle}/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        alert("Form data saved successfully!");
        navigate("/hr/leave");
      } catch (error) {
        alert("Failed to save form data");
        console.error("Failed to save form data:", error);
      }
    };

    const file_data = {
      form_id: form_id,
      action: action,
      remark: remark,
      username_receiver: username_reciever,
      designation_receiver: designation_reciever,
    };

    const sendfiledata = async () => {
      try {
        const response = await fetch(`${leave_file_handle}/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },

          body: JSON.stringify(file_data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        alert("Form data saved successfully!");
        navigate("/hr/leave");
      } catch (error) {
        alert("Failed to save form data");
        console.error("Failed to save form data:", error);
      }
    };

    if (isEditing) {
      senddata();
    } else {
      sendfiledata();
    }

    // setIsEditing(false);
    // setLoading(false);
  };

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
      <Title
        order={2}
        style={{ fontWeight: "500", marginTop: "40px", marginLeft: "15px" }}
      >
        Leave Form Details
      </Title>

      <div className="leave_container">
        {!isEditing && (
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
        )}

        <form>
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
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  onChange={handleChange}
                  disabled={!isEditing}
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
                    onChange={handleChange}
                    // onChange={(e) =>
                    //   handleLeaveBalanceChange(
                    //     index,
                    //     "startDate",
                    //     e.target.value,
                    //   )
                    // }
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
                    onChange={handleChange}
                    // onChange={(e) =>
                    //   handleLeaveBalanceChange(
                    //     index,
                    //     "startDate",
                    //     e.target.value,
                    //   )
                    // }
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
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {!isEditing && (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <Button
                leftIcon={
                  isEditing ? <FloppyDisk size={18} /> : <FileText size={18} />
                }
                onClick={handleEditClick}
                variant="outline"
              >
                <PencilSimpleLine size={16} /> &nbsp; Edit
              </Button>
            </div>
          )}

          <div className="section-divider">
            <hr
              style={{
                width: "100%",
                margin: "auto",
                marginTop: "20px",
                height: "2px",
                marginBottom: "30px",
              }}
            />
            <h3 className="section-heading">File Handling</h3>
          </div>

          {/*add  horizontal line centered and 2px and color blue */}
          {/* <hr style={{ width: "100%", margin: "auto", marginTop: "20px", height: "2px" }} />
            <br/> */}

          {/* remark */}

          <div className="grid-row">
            <div className="grid-col">
              <label className="input-label" htmlFor="remark">
                Remark
              </label>
              <div className="input-wrapper">
                <Tag size={20} />
                <input
                  type="text"
                  id="remark"
                  name="remark"
                  value={remark}
                  className="input"
                  placeholder="Enter Remark"
                  onChange={handleremark}
                  required
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          className="footer-section"
          style={{
            // corner left bottom radius
            borderRadius: "35px 0px 0px 35px",
            marginRight: "-25px",
          }}
        >
          <div className="input-wrapper">
            <User size={20} />
            <input
              type="text"
              name="username_reciever"
              placeholder="Receiver's Username"
              value={username_reciever}
              onChange={handleChangeusername_reciever}
              style={{ paddingLeft: "40px" }}
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
              value={designation_reciever}
              className="designation-input"
              style={{ paddingLeft: "40px" }}
              required
              disabled
            />
          </div>
          <Button
            leftIcon={<CheckCircle size={25} />}
            style={{ marginLeft: "50px", paddingRight: "15px" }}
            className="button"
            onClick={handleCheck}
          >
            <CheckCircle size={18} /> &nbsp; Check
          </Button>
        </div>
        <br />
        <div
          className="footer-section"
          style={{
            marginRight: "-25px",
          }}
        >
          <Button
            // type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              minwidth: "150px",
              width: "fit-content",
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "5px",

              margin: "10px",
            }}
            className="button"
            // disabled={!verifiedReceiver}
            onClick={(e) => handleSaveClick(e, "0")}
          >
            <ArrowBendUpRight size={20} /> &nbsp;{isEditing && "Save &"} Forward
          </Button>

          <Button
            // type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              minwidth: "150px",
              width: "fit-content",
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "5px",
              margin: "10px",
            }}
            className="button"
            onClick={(e) => handleSaveClick(e, "1")}
            // disabled={!verifiedReceiver}
          >
            <Prohibit color="red" size={20} />
            &nbsp; {isEditing && "SAVE &"} Reject
          </Button>

          <Button
            // type="submit"
            rightIcon={<PaperPlaneRight size={20} />}
            style={{
              marginLeft: "350px",
              minwidth: "150px",
              width: "fit-content",
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "5px",
              margin: "10px",
            }}
            className="button"
            // disabled={!verifiedReceiver}
            onClick={(e) => handleSaveClick(e, "2")}
          >
            <NavigationArrow size={20} /> &nbsp; {isEditing && "SAVE &"} Approve
          </Button>

          {!archive && (
            <Button
              // type="submit"
              rightIcon={<PaperPlaneRight size={20} />}
              style={{
                marginLeft: "350px",
                minwidth: "150px",
                width: "fit-content",
                paddingRight: "15px",
                paddingLeft: "15px",
                borderRadius: "5px",
                margin: "10px",
              }}
              className="button"
              onClick={(e) => handleSaveClick(e, "3")}
              // disabled={!verifiedReceiver}
            >
              <TrayArrowDown size={20} />
              &nbsp; {isEditing && "SAVE &"} Archive
            </Button>
          )}
          {archive && (
            <Button
              // type="submit"
              rightIcon={<PaperPlaneRight size={20} />}
              style={{
                marginLeft: "350px",
                minwidth: "150px",
                width: "fit-content",
                paddingRight: "15px",
                paddingLeft: "15px",
                borderRadius: "5px",
                margin: "10px",
              }}
              className="button"
              onClick={(e) => handleSaveClick(e, "4")}
              // disabled={!verifiedReceiver}
            >
              <UploadSimple size={20} />
              &nbsp; {isEditing && "SAVE &"} Unarchive
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveFilehandle;
