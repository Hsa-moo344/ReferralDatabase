import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      // ✅ Save login info
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", res.data.user.role);

      setIsLoggedIn(true);

      // ✅ Redirect to referral form
      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div
      style={{
        width: "50%",
        display: "block",
        margin: "auto",
        marginTop: "100px",
        padding: "20px",
        backgroundColor: "#6ba0e5",
        color: "white",
        borderRadius: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>Login</h2>
      <form
        style={{ width: "50%", margin: "0 auto", marginTop: "20px" }}
        onSubmit={handleLogin}
      >
        <input
          type="text"
          placeholder="Enter Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{
            backgroundColor: "#0349a5",
            color: "white",
            border: "none",
            padding: "10px 20px",
            width: "150px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          type="submit"
        >
          Login
        </button>
        <p>
          Do you need to create an account?{" "}
          <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
