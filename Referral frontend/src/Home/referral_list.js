import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientReferral from "../css/patient-referral-module.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../logo/images.png";
import { useLocation } from "react-router-dom";

const ReferralList = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  const rowsPerPage = 5;

  // ===== HEADER =====
  const drawHeader = (doc) => {
    // ===== LOGO (TOP CENTER) =====
    doc.addImage(logo, "PNG", 90, 5, 20, 15);
    // (x=90 center, y=5, width=20, height=15)

    // ===== TITLE =====
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("MAE TAO CLINIC", 105, 25, { align: "center" });

    // ===== ADDRESS =====
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      "702 Moo 1, Tha Sai Luad, Mae Sot District, Tak Province 63110, Thailand",
      105,
      32,
      { align: "center" },
    );

    doc.text(
      "Email: info@maetaoclinic.org | Website: www.maetaoclinic.org",
      105,
      38,
      { align: "center" },
    );

    // ===== LINE =====
    doc.line(10, 42, 200, 42);
  };

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchData();
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://referraldatabase.onrender.com/api/referrals",
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ===== SEARCH FILTER =====
  const filteredData = data.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      (item.name || "").toLowerCase().includes(search) ||
      (item.rn || "").toLowerCase().includes(search)
    );
  });

  // ===== PAGINATION =====
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // ===== EDIT =====
  const handleEdit = (id) => {
    navigate(`/edit-referral/${id}`);
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this record?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://referraldatabase.onrender.com/api/referrals/${id}`,
      );
      alert("Deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete");
    }
  };
  // ===== PDF HELPERS =====

  const PAGE_HEIGHT = 280;

  const checkPageBreak = (doc, y) => {
    if (y > PAGE_HEIGHT) {
      doc.addPage();
      drawHeader(doc);
      return 50;
    }
    return y;
  };

  const addWrappedText = (doc, text, x, y, width = 180) => {
    const lines = doc.splitTextToSize(text || "-", width);

    doc.text(lines, x, y);

    return y + lines.length * 5;
  };

  // ===== DOWNLOAD PDF =====
  const downloadPDF = () => {
    const doc = new jsPDF();

    filteredData.forEach((item, index) => {
      if (index > 0) doc.addPage();

      drawHeader(doc);

      let y = 50;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Patient Referral Form", 105, y, {
        align: "center",
      });

      y += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // =========================
      // PATIENT INFO
      // =========================

      doc.text(`R/N: ${item.rn || ""}`, 10, y);
      doc.text(`MSH-HN: ${item.msh_hn || ""}`, 110, y);

      y += 7;

      doc.text(`Name: ${item.name || ""}`, 10, y);
      doc.text(`Sex: ${item.gender || ""}`, 140, y);
      doc.text(`Age: ${item.age || ""}`, 170, y);

      y += 7;

      doc.text(`Residence: ${item.place_of_residence || ""}`, 10, y);

      y += 7;

      doc.text(
        `Date of Seeing: ${
          item.date_of_seeing ? item.date_of_seeing.split("T")[0] : ""
        }`,
        10,
        y,
      );

      // =========================
      // CASE SUMMARY
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("1. Case Summary", 10, y);

      y += 8;

      doc.setFont("helvetica", "normal");

      doc.text("Current Complaint:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.current_complaint, 10, y);

      y += 5;
      y = checkPageBreak(doc, y);

      doc.text("Refer Information:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.refer_information, 10, y);

      y += 5;
      y = checkPageBreak(doc, y);

      doc.text("Past History:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.past_history, 10, y);

      y += 5;
      y = checkPageBreak(doc, y);

      doc.text("Surgical History:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.surgical_history, 10, y);

      y += 5;
      y = checkPageBreak(doc, y);

      doc.text("Drug Allergy:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.drug_allergy, 10, y);

      y += 5;
      y = checkPageBreak(doc, y);

      doc.text("Birth History:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.birth_history, 10, y);

      y += 5;
      y = checkPageBreak(doc, y);

      doc.text("Immunization History:", 10, y);
      y += 6;
      y = addWrappedText(doc, item.immunization_history, 10, y);

      // =========================
      // INVESTIGATION
      // =========================

      y += 8;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("2. Essential Investigations", 10, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      y = addWrappedText(doc, item.essential_investigations, 10, y);

      // =========================
      // VITAL SIGNS
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("3. Vital Signs", 10, y);

      y += 7;

      doc.setFont("helvetica", "normal");

      doc.text(
        `Weight: ${item.weight || ""}    SPO2: ${item.spo2 || ""}    BP: ${item.bp || ""}`,
        10,
        y,
      );

      y += 6;

      doc.text(
        `PR: ${item.pr || ""}    RR: ${item.rr || ""}    Temp: ${item.temp || ""}`,
        10,
        y,
      );

      // =========================
      // DIAGNOSIS
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("4. Initial Diagnosis", 10, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      y = addWrappedText(doc, item.initial_diagnosis, 10, y);

      // =========================
      // TREATMENT
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("5. Treatment Before Referral", 10, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      y = addWrappedText(doc, item.treatment_before_referral, 10, y);

      // =========================
      // REASON
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("6. Reasons For Referral", 10, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      y = addWrappedText(doc, item.reasons_for_referral, 10, y);

      // =========================
      // INSURANCE
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.text(`7. Insurance: ${item.health_insurance || ""}`, 10, y);

      // =========================
      // OTHER
      // =========================

      y += 10;
      y = checkPageBreak(doc, y);

      doc.setFont("helvetica", "bold");
      doc.text("8. Other Information", 10, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      y = addWrappedText(doc, item.other_information, 10, y);

      // =========================
      // FOOTER
      // =========================

      y += 15;
      y = checkPageBreak(doc, y);

      doc.text(`Phone Number: ${item.phone_number || ""}`, 10, y);

      y += 8;

      doc.text(`Department: ${item.department_name || ""}`, 10, y);

      y += 8;

      doc.text(
        `Referral Date: ${
          item.referral_date ? item.referral_date.split("T")[0] : ""
        }`,
        10,
        y,
      );

      y += 8;

      doc.text(`Medic Name / Signature: ${item.medic_signature || ""}`, 10, y);
    });

    doc.save("Referral_Form.pdf");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className={PatientReferral.ListReferralContainer}>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "8px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <h2 style={{ textAlign: "center" }}>Patient Referral List</h2>

      {/* SEARCH BOX */}
      <div className={PatientReferral.searchBox}>
        <input
          type="text"
          placeholder="Search by Name or R/N..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={PatientReferral.searchInput}
        />
      </div>

      <button
        onClick={() => navigate("/")}
        className={PatientReferral.BackButton}
      >
        ← Back to Form
      </button>

      <div style={{ textAlign: "center" }}>
        <div className={PatientReferral.TableContainer}>
          <table className={PatientReferral.ReferralTable}>
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th style={{ border: "1px solid black" }}>ID</th>
                <th style={{ border: "1px solid black" }}>R/N</th>
                <th style={{ border: "1px solid black" }}>Name</th>
                <th style={{ border: "1px solid black" }}>Gender</th>
                <th style={{ border: "1px solid black" }}>Age</th>
                <th style={{ border: "1px solid black" }}>Diagnosis</th>
                <th style={{ border: "1px solid black" }}>Department</th>
                <th style={{ border: "1px solid black" }}>Date</th>
                <th style={{ border: "1px solid black" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr key={item.id} style={{ textAlign: "center" }}>
                    <td style={{ border: "1px solid black" }}>{item.id}</td>
                    <td style={{ border: "1px solid black" }}>{item.rn}</td>
                    <td style={{ border: "1px solid black" }}>{item.name}</td>
                    <td style={{ border: "1px solid black" }}>{item.gender}</td>
                    <td style={{ border: "1px solid black" }}>{item.age}</td>
                    <td style={{ border: "1px solid black" }}>
                      {item.initial_diagnosis || ""}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {item.department_name || ""}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {item.referral_date
                        ? item.referral_date.split("T")[0]
                        : ""}
                    </td>

                    <td style={{ border: "1px solid black" }}>
                      <button
                        className={PatientReferral.EditButton}
                        onClick={() => handleEdit(item.id)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className={PatientReferral.DeleteButton}
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className={PatientReferral.pagination}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀ Previous
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next ▶
            </button>
          </div>
          <button onClick={downloadPDF} className={PatientReferral.downloadBtn}>
            📄 Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralList;
