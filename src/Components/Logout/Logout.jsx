import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "./auth";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("username");
  };
  return (
    isAuthenticated() && (
      <Link style={{ textDecoration: "none" }} to="/">
        <button
          className="btn btn-primary"
          style={{ marginLeft: "10px", marginBottom: "10px" }}
          onClick={handleLogout}
        >
          Salir
        </button>
      </Link>
    )
  );
}
