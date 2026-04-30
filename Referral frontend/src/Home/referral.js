import React, { useState, useEffect } from "react";
import PatientReferral from "../css/patient-referral-module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Referalform = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const departmentlist = [
    "Adult OPD",
    "Adult IPD",
    "Emergency",
    "RH OPD",
    "RH IPD",
    "Surgical OPD",
    "Surgical IPD",
    "Child OPD",
    "Child IPD",
    "Eye",
    "Dental",
  ];

  const [formData, setFormData] = useState({
    rn: "",
    mshHn: "",
    name: "",
    gender: "",
    age: "",
    placeOfResidence: "",
    dateOfSeeing: "",

    currentCondition: "",
    essentialInvestigations: "",

    vitalSigns: {
      weight: "",
      bp: "",
      pr: "",
      rr: "",
      temp: "",
    },

    initialDiagnosis: "",
    treatmentBeforeReferral: "",
    reasonsForReferral: "",

    healthInsurance: "",
    otherInformation: "",
    phone_number: "",

    medicSignature: "",
    departmentName: "",
    date: "",
  });

  // Handle normal input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle vital signs
  const handleVitalChange = (e) => {
    setFormData({
      ...formData,
      vitalSigns: {
        ...formData.vitalSigns,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/referrals/${id}`, formData);
        alert("Updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/referrals", formData);
        alert("Saved successfully!");
      }

      // ✅ send refresh signal
      // navigate("/referral-list", { state: { refresh: true } });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/api/referrals/${id}`)
        .then((res) => {
          const data = res.data;

          setFormData({
            rn: data.rn || "",
            mshHn: data.msh_hn || "",
            name: data.name || "",
            gender: data.gender || "",
            age: data.age || "",
            placeOfResidence: data.place_of_residence || "",

            // ✅ ONLY ONE dateOfSeeing
            dateOfSeeing: data.date_of_seeing
              ? data.date_of_seeing.split("T")[0]
              : "",

            currentCondition: data.current_condition || "",
            essentialInvestigations: data.essential_investigations || "",

            vitalSigns: {
              weight: data.weight || "",
              bp: data.bp || "",
              pr: data.pr || "",
              rr: data.rr || "",
              temp: data.temp || "",
            },

            initialDiagnosis: data.initial_diagnosis || "",
            treatmentBeforeReferral: data.treatment_before_referral || "",
            reasonsForReferral: data.reasons_for_referral || "",

            healthInsurance: data.health_insurance || "",
            otherInformation: data.other_information || "",
            phone_number: data.phone_number || "",

            medicSignature: data.medic_signature || "",
            departmentName: data.department_name || "",
            date: data.record_date ? data.record_date.split("T")[0] : "",
          });
        })
        .catch((err) => console.error(err));
    }
  }, [id]);
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole"); // ✅ important
    navigate("/login");
  };

  return (
    <div className={PatientReferral.MainReferralContainer}>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <div className={PatientReferral.HeaderSession}>
        <h2 style={{ textAlign: "center" }}>
          MTC - Self Patient Referral Form Page
        </h2>
        <div className={PatientReferral.SubHeaderSession}>
          <h3 style={{ textAlign: "center" }}>Patient Referral</h3>
        </div>
        <div
          style={{
            width: "60%",
            margin: "0 auto",
            backgroundColor: "#f4f7fb",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Patient Info */}
            <div className={PatientReferral.PatientInfoSection}>
              <label>R/N</label>
              <input name="rn" value={formData.rn} onChange={handleChange} />

              <label>MSH-HN</label>
              <input
                name="mshHn"
                value={formData.mshHn}
                onChange={handleChange}
              />

              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <label>Age</label>
              <input name="age" value={formData.age} onChange={handleChange} />

              <label>Place of Residence</label>
              <select
                name="placeOfResidence"
                value={formData.placeOfResidence}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Thailand</option>
                <option>Myanmar</option>
              </select>

              <label>Date of Seeing</label>
              <input
                type="date"
                name="dateOfSeeing"
                value={formData.dateOfSeeing}
                onChange={handleChange}
              />
            </div>

            {/* Clinical */}
            <div className={PatientReferral.ClinicalSection}>
              <label>Current Condition</label>
              <textarea
                name="currentCondition"
                value={formData.currentCondition}
                onChange={handleChange}
              />

              <label>Essential Investigations Results</label>
              <textarea
                name="essentialInvestigations"
                value={formData.essentialInvestigations}
                onChange={handleChange}
              />

              {/* Vital Signs */}
              <div>
                <label>Vital Signs</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    name="weight"
                    value={formData.vitalSigns.weight}
                    onChange={handleVitalChange}
                    placeholder="weight"
                  />

                  <input
                    name="bp"
                    value={formData.vitalSigns.bp}
                    onChange={handleVitalChange}
                    placeholder="body pressure"
                  />

                  <input
                    name="pr"
                    value={formData.vitalSigns.pr}
                    onChange={handleVitalChange}
                    placeholder="pulse rate"
                  />

                  <input
                    name="rr"
                    value={formData.vitalSigns.rr}
                    onChange={handleVitalChange}
                    placeholder="respiratory rate"
                  />

                  <input
                    name="temp"
                    value={formData.vitalSigns.temp}
                    onChange={handleVitalChange}
                    placeholder="temperature"
                  />
                </div>
              </div>

              {/* Diagnosis */}
              <label>Initial Diagnosis</label>
              <input
                name="initialDiagnosis"
                value={formData.initialDiagnosis}
                onChange={handleChange}
              />

              <label>Treatment given before referral</label>
              <textarea
                name="treatmentBeforeReferral"
                value={formData.treatmentBeforeReferral}
                onChange={handleChange}
              />
            </div>
            <div className={PatientReferral.reasonsForReferral}>
              <label>Reasons for referral</label>
              <textarea
                name="reasonsForReferral"
                value={formData.reasonsForReferral}
                onChange={handleChange}
              />
            </div>

            {/* Insurance */}
            <div className={PatientReferral.InsuranceSection}>
              <label>Health Insurance Information</label>
              <select
                name="healthInsurance"
                value={formData.healthInsurance}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>M-Fund</option>
                <option>10 Year card</option>
                <option>Social Security</option>
              </select>
            </div>
            <div className={PatientReferral.otherInformation}>
              <label>Other</label>
              <textarea
                name="otherInformation"
                value={formData.otherInformation}
                onChange={handleChange}
              />

              <label>Phone</label>
              <input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            {/* Footer */}
            <div className={PatientReferral.FooterSection}>
              <label>Medic Name</label>
              <input
                name="medicSignature"
                value={formData.medicSignature}
                onChange={handleChange}
              />
              <label>Department</label>
              <select
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
              >
                <option value="">Select the Departments</option>
                {departmentlist.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Submit</button>
            <button
              type="button"
              onClick={() =>
                navigate("/referral-list", { state: { refresh: true } })
              }
              className={PatientReferral.ReferralListButton}
            >
              View Department List
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Referalform;
