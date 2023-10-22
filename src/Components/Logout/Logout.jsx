import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "./auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("username");
  };
  return (
    isAuthenticated() && (
      <Link style={{ textDecoration: "none" }} to="/">
        <button
          className="btn btn-danger"
          style={{ marginLeft: "10px", marginBottom: "10px" }}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} /> {/* Aquí se agrega el ícono */}
        </button>
      </Link>
    )
  );
}
