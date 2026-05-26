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
    "ECU",
    "Mental Health",
  ];

  const [formData, setFormData] = useState({
    rn: "",
    mshHn: "",
    name: "",
    gender: "",
    age: "",
    placeOfResidence: "",
    dateOfSeeingbyMTC: "",

    caseSummary: "",
    essentialInvestigations: "",

    vitalSigns: {
      weight: "",
      spo2: "",
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
    dateOfReferral: "",
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
        await axios.put(
          `https://referraldatabase.onrender.com/api/referrals/${id}`,
          formData,
        );
        alert("Updated successfully!");
      } else {
        await axios.post(
          "https://referraldatabase.onrender.com/api/referrals",
          formData,
        );
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
        .get(`https://referraldatabase.onrender.com/api/referrals/${id}`)
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
            dateOfSeeingbyMTC: data.date_of_seeing_by_mtc
              ? data.date_of_seeing_by_mtc.split("T")[0]
              : "",

            caseSummary: data.case_summary || "",
            essentialInvestigations: data.essential_investigations || "",

            vitalSigns: {
              weight: data.weight || "",
              spo2: data.spo2 || "",
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
            dateOfReferral: data.date_of_referral
              ? data.date_of_referral.split("T")[0]
              : "",
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
        <h2 style={{ textAlign: "center" }}>MTC -Patient Referral Form Page</h2>
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

              <label>Date of Seeing by MTC</label>
              <input
                type="date"
                name="dateOfSeeingbyMTC"
                value={formData.dateOfSeeingbyMTC}
                onChange={handleChange}
              />
            </div>

            {/* Clinical */}
            <div className={PatientReferral.ClinicalSection}>
              <strong>Case Summary</strong>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <label>Case Summary</label>
                  <textarea
                    name="caseSummary"
                    value={formData.caseSummary}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Current Complaint or Concern</label>
                  <textarea
                    name="currentComplaint"
                    value={formData.currentComplaint}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Refer information for current concern </label>
                  <textarea
                    name="referInformation"
                    value={formData.referInformation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <label>Any past history (medicine)</label>
                  <textarea
                    name="pastHistory"
                    value={formData.pastHistory}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Any past history (surgical) </label>
                  <textarea
                    name="surgicalHistory"
                    value={formData.surgicalHistory}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <label>Drug allergy</label>
                  <textarea
                    name="drugAllergy"
                    value={formData.drugAllergy}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Birth history (for neonate) </label>
                  <textarea
                    name="birthHistory"
                    value={formData.birthHistory}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Immunization history (for child) </label>
                  <textarea
                    name="immunizationHistory"
                    value={formData.immunizationHistory}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                  <label>Weight</label>
                  <input
                    name="weight"
                    value={formData.vitalSigns.weight}
                    onChange={handleVitalChange}
                    placeholder="weight"
                  />

                  <label>SPO2</label>

                  <input
                    name="spo2"
                    value={formData.vitalSigns.spo2}
                    onChange={handleVitalChange}
                    placeholder="oxygen saturation"
                  />

                  <label>BP</label>
                  <input
                    name="bp"
                    value={formData.vitalSigns.bp}
                    onChange={handleVitalChange}
                    placeholder="blood pressure"
                  />

                  <label>PR</label>
                  <input
                    name="pr"
                    value={formData.vitalSigns.pr}
                    onChange={handleVitalChange}
                    placeholder="pulse rate"
                  />

                  <label>RR</label>
                  <input
                    name="rr"
                    value={formData.vitalSigns.rr}
                    onChange={handleVitalChange}
                    placeholder="respiratory rate"
                  />

                  <label>Temp</label>
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
                <option>NA</option>
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

              <label>Date of Referral</label>
              <input
                type="date"
                name="dateOfReferral"
                value={formData.dateOfReferral}
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
