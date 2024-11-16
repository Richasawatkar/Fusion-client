// src/Modules/HR/components/CPDA_ClaimForm.js
import React, { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import {
  PaperPlaneRight,
  CheckCircle,
  User,
  Tag,
  IdentificationCard,
  Calendar,
  ClipboardText,
  CurrencyDollar,
  FileText,
  PencilSimpleLine,
  ArrowBendUpRight,
  Prohibit,
  NavigationArrow,
  TrayArrowDown,
  UploadSimple,
} from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm } from "../../../../redux/formSlice";
import "./CPDA_ClaimForm.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  cpda_claim_edit_handle,
  cpda_claim_file_handle,
  get_form_id,
  get_my_details,
  search_employee,
  submit_cpda_claim_form,
  view_cpda_claim_form,
} from "../../../../routes/hr";
import LoadingComponent from "../../components/Loading";
import HrBreadcrumbs from "../../components/HrBreadcrumbs";
import { EmptyTable } from "../../components/tables/EmptyTable";

const CPDA_ClaimFilehandle = () => {
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
    { title: "CPDA_Adv", path: "/hr/cpda_adv" },
    { title: "File Handle", path: `/hr/cpda_adv/file_handler/${id}` },
  ];

  console.log(id);

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
        console.log(response1);

        if (!response1.ok) {
          throw new Error("Network response was not ok");
        }

        const data1 = await response1.json();
        setForm_id(data1.form_id);
        console.log(data1);
        console.log(data1.form_id);

        const response = await fetch(
          `${view_cpda_claim_form}/${data1.form_id}`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        console.log(response);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        let data = await response.json();
        console.log(data);

        setfetchedformData(data);
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
      pfNo: fetchedformData.pfNo,
      purpose: fetchedformData.purpose,
      adjustmentSubmitted: fetchedformData.adjustmentSubmitted,
      advanceTaken: fetchedformData.advanceTaken,
      balanceAvailable: fetchedformData.balanceAvailable,
      advanceAmountPDA: fetchedformData.advanceAmountPDA,
      amountCheckedInPDA: fetchedformData.amountCheckedInPDA,
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
        const response = await fetch(`${cpda_claim_edit_handle}/${id}/`, {
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
        navigate("/hr/cpda_claim");
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
        const response = await fetch(`${cpda_claim_file_handle}/${id}/`, {
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
        navigate("/hr/cpda_claim");
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
  console.log(fetchedformData);

  return (
    <div className="CPDA_ClaimForm_container">
      <form>
        {/* Row 1: Name and Designation */}
        <div className="grid-row">
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

        {/* Row 2: Amount Required and Date */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="amountRequired">
              Adjustment/Reimbursement Submitted for Rs.
            </label>
            <div className="input-wrapper">
              <CurrencyDollar size={20} />
              <input
                type="text"
                id="adjustmentSubmitted"
                name="adjustmentSubmitted"
                placeholder="Amount Required"
                value={fetchedformData.adjustmentSubmitted}
                onChange={handleChange}
                className="input"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="balanceDate">
              Date
            </label>
            <div className="input-wrapper">
              <Calendar size={20} />
              <input
                type="date"
                id="submissionDate"
                name="submissionDate"
                value={fetchedformData.submissionDate}
                onChange={handleChange}
                className="input"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Row 3: Advance Taken and PF Number */}
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="advanceTaken">
              Advance Taken
            </label>
            <div className="input-wrapper">
              <CurrencyDollar size={20} />
              <input
                type="text"
                id="advanceTaken"
                name="advanceTaken"
                placeholder="Amount Required"
                value={fetchedformData.advanceTaken}
                onChange={handleChange}
                className="input"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid-col">
            <label className="input-label" htmlFor="pfNumber">
              PF Number
            </label>
            <div className="input-wrapper">
              <IdentificationCard size={20} />
              <input
                type="text"
                id="pfNo"
                name="pfNo"
                placeholder="XXXXXXXXXXXX"
                value={fetchedformData.pfNo}
                onChange={handleChange}
                className="input"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Purpose */}
        <div className="grid-row">
          <div className="grid-col" style={{ flexGrow: 2 }}>
            <label className="input-label" htmlFor="purpose">
              Purpose
            </label>
            <div className="input-wrapper">
              <ClipboardText size={20} />
              <input
                type="text"
                id="purpose"
                name="purpose"
                placeholder="Purpose"
                value={fetchedformData.purpose}
                onChange={handleChange}
                className="input"
                style={{ width: "60%" }}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Row 5: Internal Audit */}
        <div className="section-divider">
          <hr className="divider-line" />
          <h3 className="section-heading">Internal Audit</h3>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="billChecked">
              Bill Checked in Audit for Rs.
            </label>
            <div className="input-wrapper">
              <FileText size={20} />
              <input
                type="text"
                id="amountCheckedInPDA"
                name="amountCheckedInPDA"
                placeholder="Audit Entry"
                value={fetchedformData.amountCheckedInPDA}
                onChange={handleChange}
                className="input"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Row :6 Estt. Section */}
        <div className="section-divider">
          <hr className="divider-line" />
          <h3 className="section-heading">Estt. Section</h3>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <label className="input-label" htmlFor="balanceDate">
              Balance available as on date
            </label>
            <div className="input-wrapper">
              <CurrencyDollar size={20} />
              <input
                type="number"
                id="balanceAvailable"
                name="balanceAvailable"
                placeholder="Enter balanceAvailable"
                value={fetchedformData.balanceAvailable}
                onChange={handleChange}
                className="input"
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="grid-col">
            <label className="input-label" htmlFor="pdaPageNumber">
              Adjustment/Reimbursement amount entered in PDA Register page no.
            </label>
            <div className="input-wrapper">
              <FileText size={20} />
              <input
                type="text"
                id="advanceAmountPDA"
                name="advanceAmountPDA"
                placeholder="advanceAmountPDA"
                value={fetchedformData.advanceAmountPDA}
                onChange={handleChange}
                className="input"
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
                style={{ width: "60%" }}
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
  );
};

export default CPDA_ClaimFilehandle;
