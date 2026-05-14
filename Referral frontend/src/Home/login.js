import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PatientReferral from "../css/patient-referral-module.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  /* ======================================
     LOGIN
  ====================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      if (res.data.success) {
        // Save login status
        localStorage.setItem("isLoggedIn", "true");

        // Update App state
        setIsLoggedIn(true);

        alert("Login successful");

        // Redirect
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={PatientReferral.loginContainer}>
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>Login</h2>

      <form
        style={{
          textAlign: "center",
          width: "30%",
          marginLeft: "auto",
          marginRight: "auto",
          border: "none",
          padding: "30px",
          borderRadius: "8px",
          backgroundColor: "#f2f2f2",
          marginTop: "20px",
        }}
        onSubmit={handleLogin}
      >
        <div style={{ margin: "15px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={{ margin: "15px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
