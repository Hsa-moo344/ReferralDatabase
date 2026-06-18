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

  // // ===== DOWNLOAD PDF =====

  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("1. Case Summary", 10, y);

  y += 5;

  // Draw table
  doc.rect(10, y, 190, 35);

  // Vertical lines
  doc.line(57, y, 57, y + 35);
  doc.line(104, y, 104, y + 35);
  doc.line(152, y, 152, y + 35);

  // Headers
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");

  doc.text("Current Complaint", 12, y + 5);
  doc.text("Refer Information", 59, y + 5);
  doc.text("Past History", 106, y + 5);
  doc.text("Surgical History", 154, y + 5);

  doc.setFont("helvetica", "normal");

  // Values
  doc.text(item.current_complaint || "-", 12, y + 12, { maxWidth: 42 });
  doc.text(item.refer_information || "-", 59, y + 12, { maxWidth: 42 });
  doc.text(item.past_history || "-", 106, y + 12, { maxWidth: 42 });
  doc.text(item.surgical_history || "-", 154, y + 12, { maxWidth: 42 });

  y += 40;

  // =========================
  // SECOND ROW
  // =========================

  doc.rect(10, y, 190, 25);

  doc.line(73, y, 73, y + 25);
  doc.line(136, y, 136, y + 25);

  doc.setFont("helvetica", "bold");

  doc.text("Drug Allergy", 12, y + 5);
  doc.text("Birth History", 75, y + 5);
  doc.text("Immunization History", 138, y + 5);
  doc.setFont("helvetica", "normal");

  doc.text(item.drug_allergy || "-", 12, y + 12, { maxWidth: 55 });
  doc.text(item.birth_history || "-", 75, y + 12, { maxWidth: 55 });
  doc.text(item.immunization_history || "-", 138, y + 12, {
    maxWidth: 55,
  });

  y += 35;

  // =========================
  // INVESTIGATION / VITAL / DIAGNOSIS
  // =========================

  doc.rect(10, y, 190, 30);

  doc.line(75, y, 75, y + 30);
  doc.line(140, y, 140, y + 30);

  doc.setFont("helvetica", "bold");

  doc.text("2. Essential Investigations", 12, y + 5);
  doc.text("3. Vital Signs", 77, y + 5);
  doc.text("4. Initial Diagnosis", 142, y + 5);

  doc.setFont("helvetica", "normal");

  doc.text(item.essential_investigations || "-", 12, y + 13, {
    maxWidth: 60,
  });

  doc.text(
    `Weight:${item.weight || ""}
    SPO2:${item.spo2 || ""}
    BP:${item.bp || ""}
    PR:${item.pr || ""}
    RR:${item.rr || ""}
    Temp:${item.temp || ""}`,
    77,
    y + 10,
  );

  doc.text(item.initial_diagnosis || "-", 142, y + 13, {
    maxWidth: 55,
  });

  y += 40;

  // =========================
  // TREATMENT / REASON / INSURANCE / OTHER
  // =========================

  doc.rect(10, y, 190, 30);

  doc.line(57, y, 57, y + 30);
  doc.line(104, y, 104, y + 30);
  doc.line(152, y, 152, y + 30);

  doc.setFont("helvetica", "bold");

  doc.text("5. Treatment", 12, y + 5);
  doc.text("6. Reasons", 59, y + 5);
  doc.text("7. Insurance", 106, y + 5);
  doc.text("8. Other", 154, y + 5);

  doc.setFont("helvetica", "normal");

  doc.text(item.treatment_before_referral || "-", 12, y + 12, {
    maxWidth: 42,
  });

  doc.text(item.reasons_for_referral || "-", 59, y + 12, {
    maxWidth: 42,
  });

  doc.text(item.health_insurance || "-", 106, y + 12, {
    maxWidth: 42,
  });

  doc.text(item.other_information || "-", 154, y + 12, {
    maxWidth: 42,
  });

  y += 40;

  // =========================
  // FOOTER
  // =========================

  doc.text(`Phone Number: ${item.phone_number || ""}`, 10, y);
  doc.text(`Department: ${item.department_name || ""}`, 90, y);

  y += 10;

  doc.text(
    `Referral Date: ${
      item.referral_date ? item.referral_date.split("T")[0] : ""
    }`,
    10,
    y,
  );

  y += 15;

  doc.text(`Medic Name: ${item.medic_signature || ""}`, 10, y);

  y += 12;

  // signature line
  doc.line(10, y, 80, y);

  y += 5;

  doc.text("Signature", 10, y);

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
