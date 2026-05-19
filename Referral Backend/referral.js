const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= MYSQL CONNECTION ================= */

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "refer",
//   password: "123456",
//   database: "referraldatabase",
// });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  ssl: {
    rejectUnauthorized: false,
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

  const sql = `
    INSERT INTO patient_referrals (
      rn,
      msh_hn,
      name,
      gender,
      age,
      place_of_residence,
      date_of_seeing,
      current_condition,
      essential_investigations,
      weight,
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
      record_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.rn,
    data.mshHn,
    data.name,
    data.gender,
    data.age,
    data.placeOfResidence,
    data.dateOfSeeing,

    data.currentCondition,
    data.essentialInvestigations,

    data.vitalSigns.weight,
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
    data.date,
  ];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving data");
    }

    res.send("Saved successfully");
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

/* ================= GET SINGLE REFERRAL ================= */

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

/* ================= UPDATE REFERRAL ================= */

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
      date_of_seeing=?,
      current_condition=?,
      essential_investigations=?,
      weight=?,
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
      record_date=?
    WHERE id=?
  `;

  const values = [
    data.rn,
    data.mshHn,
    data.name,
    data.gender,
    data.age,
    data.placeOfResidence,
    data.dateOfSeeing,
    data.currentCondition,
    data.essentialInvestigations,
    data.vitalSigns.weight,
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
    data.date,
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

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
