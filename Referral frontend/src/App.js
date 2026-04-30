import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Referalform from "./Home/referral";
import ReferralList from "./Home/referral_list";
import Login from "./Home/login";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true",
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* PROTECTED ROUTE */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Referalform setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/referral-list"
          element={isLoggedIn ? <ReferralList /> : <Navigate to="/login" />}
        />

        <Route
          path="/edit-referral/:id"
          element={isLoggedIn ? <Referalform /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
