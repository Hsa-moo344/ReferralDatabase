const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= MYSQL CONNECTION ================= */
const pool = mysql.createPool({
  host: "localhost",
  user: "refer",
  password: "123456",
  database: "referraldatabase",
});

/* ================= LOGIN API ================= */
app.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  username = username?.trim();
  password = password?.trim();

  const sql = `
     SELECT id, username, password
    FROM referral_tbl
    WHERE username = ? AND password = ?
  `;

  pool.query(sql, [username, password], (err, results) => {
    if (err) {
      console.log("DB ERROR:", err); // 👈 ADD THIS
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    res.json({
      message: "Login successful",
      user: results[0],
    });
  });
});

/* ✅ API ROUTE */
app.post("/api/referrals", (req, res) => {
  const data = req.body;

  const sql = `
    INSERT INTO patient_referrals (
      rn, msh_hn, name, gender, age, place_of_residence, date_of_seeing,
      current_condition, essential_investigations,
      weight, bp, pr, rr, temp,
      initial_diagnosis, treatment_before_referral, reasons_for_referral,
      health_insurance, other_information, phone_number,
      medic_signature, department_name, record_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

/* GET ALL REFERRALS */
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

      res.json(result[0]); // ✅ correct
    },
  );
});

app.put("/api/referrals/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  await pool.query(
    `UPDATE patient_referrals SET
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
     WHERE id=?`,
    [
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
    ],
  );

  res.json({ message: "Updated successfully" });
});

app.delete("/api/referrals/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM patient_referrals WHERE id = ?", [id]);

  res.json({ message: "Deleted" });
});

/* SERVER */
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
