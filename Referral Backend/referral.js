require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= MYSQL CONNECTION ================= */

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  port: Number(process.env.DB_PORT), // 🔥 IMPORTANT FIX

  connectTimeout: 20000, // 🔥 prevent ETIMEDOUT

  ssl: {
    rejectUnauthorized: false, // required for Aiven
  },
});

/* ================= LOGIN API ================= */

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  const sql = "SELECT * FROM referral_tbl WHERE username = ? AND password = ?";

  pool.query(sql, [username.trim(), password.trim()], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    // User not found
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Login successful
    res.json({
      success: true,
      message: "Login successful",
      user: results[0],
    });
  });
});

/* ================= SAVE REFERRAL ================= */

app.post("/api/referrals", (req, res) => {
  const data = req.body;

  console.log("Received data from frontend:");
  console.log(data);

  const sql = `
    INSERT INTO patient_referrals (
      rn,
      msh_hn,
      name,
      gender,
      age,
      place_of_residence,
      date_of_seeing_by_mtc,
      case_summary,
      current_complaint,
      refer_information,
      past_history,
      surgical_history,
      drug_allergy,
      birth_history,
      immunization_history,
      essential_investigations,
      examination_findings,
      weight,
      spo2,
      bp,
      pr,
      rr,
      temp,
      initial_diagnosis,
      treatment_before_referral,
      reasons_for_referral,
      health_insurance,
      other_information,
      phone_number,
      medic_signature,
      department_name,
      referral_date
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    data.rn || null,
    data.mshHn || null,
    data.name || null,
    data.gender || null,
    data.age || null,
    data.placeOfResidence || null,

    // FIX HERE
    data.dateOfSeeingbyMTC || null,

    data.caseSummary || null,
    data.currentComplaint || null,
    data.referInformation || null,

    data.pastHistory || null,
    data.surgicalHistory || null,
    data.drugAllergy || null,
    data.birthHistory || null,
    data.immunizationHistory || null,
    data.essentialInvestigations || null,
    data.examinationFindings || null,

    data.vitalSigns?.weight || null,
    data.vitalSigns?.spo2 || null,
    data.vitalSigns?.bp || null,
    data.vitalSigns?.pr || null,
    data.vitalSigns?.rr || null,
    data.vitalSigns?.temp || null,

    data.initialDiagnosis || null,
    data.treatmentBeforeReferral || null,
    data.reasonsForReferral || null,

    data.healthInsurance || null,
    data.otherInformation || null,
    data.phone_number || null,

    data.medicSignature || null,
    data.departmentName || null,
    data.dateOfReferral || null,
  ];

  console.log("INSERT VALUES");
  console.log(values);

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.log("===== MYSQL INSERT ERROR =====");

      console.log("Error Code:", err.code);

      console.log("Message:", err.sqlMessage);

      console.log("SQL:", err.sql);

      return res.status(500).json({
        success: false,
        error: err.sqlMessage,
      });
    }

    res.json({
      success: true,
      insertId: result.insertId,
    });
  });
});
/* ================= GET ALL REFERRALS ================= */

app.get("/api/referrals", (req, res) => {
  const sql = "SELECT * FROM patient_referrals ORDER BY id DESC";

  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching data");
    }

    res.json(result);
  });
});

// Check the route
app.get("/api/check-columns", (req, res) => {
  pool.query("SHOW COLUMNS FROM patient_referrals", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// /* ================= GET SINGLE REFERRAL ================= */

app.get("/api/referrals/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT * FROM patient_referrals WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error fetching data");
      }

      res.json(result[0]);
    },
  );
});

// /* ================= UPDATE REFERRAL ================= */

app.put("/api/referrals/:id", (req, res) => {
  const { id } = req.params;

  const data = req.body;

  const sql = `
    UPDATE patient_referrals SET
      rn=?,
      msh_hn=?,
      name=?,
      gender=?,
      age=?,
      place_of_residence=?,
      date_of_seeing_by_mtc=?,
      case_summary=?,
      current_complaint=?,
      refer_information=?,
      past_history=?,
      surgical_history=?,
      drug_allergy=?,
      birth_history=?,
      immunization_history=?,
      essential_investigations=?,
      examination_findings=?,
      weight=?,
      spo2=?,
      bp=?,
      pr=?,
      rr=?,
      temp=?,
      initial_diagnosis=?,
      treatment_before_referral=?,
      reasons_for_referral=?,
      health_insurance=?,
      other_information=?,
      phone_number=?,
      medic_signature=?,
      department_name=?,
      referral_date=?
    WHERE id=?
  `;

  const values = [
    data.rn,
    data.mshHn,
    data.name,
    data.gender,
    data.age,
    data.placeOfResidence,
    data.dateOfSeeingByMTC,
    data.caseSummary,
    data.currentComplaint,
    data.referInformation,
    data.pastHistory,
    data.surgicalHistory,
    data.drugAllergy,
    data.birthHistory,
    data.immunizationHistory,
    data.essentialInvestigations,
    data.examinationFindings || null,
    data.vitalSigns.weight,
    data.vitalSigns.spo2,
    data.vitalSigns.bp,
    data.vitalSigns.pr,
    data.vitalSigns.rr,
    data.vitalSigns.temp,
    data.initialDiagnosis,
    data.treatmentBeforeReferral,
    data.reasonsForReferral,
    data.healthInsurance,
    data.otherInformation,
    data.phone_number,
    data.medicSignature,
    data.departmentName,
    data.dateOfReferral,
    id,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Update failed",
      });
    }

    res.json({
      success: true,
      message: "Updated successfully",
    });
  });
});

/* ================= DELETE REFERRAL ================= */

app.delete("/api/referrals/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "DELETE FROM patient_referrals WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Delete failed",
        });
      }

      res.json({
        success: true,
        message: "Deleted successfully",
      });
    },
  );
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
