import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const [warnings, setWarnings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let username = sessionStorage.getItem("username");
    let id = username.substring(1);
    axios
      .get(`http://localhost:5000/warning/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setWarnings(response.data))
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <div>
      <nav className="ms-4 mt-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link style={{ textDecoration: "none" }} to="/dashboard">
              Course
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Warning
          </li>
        </ol>
      </nav>
      <div className="card m-4">
        <div className="card-body">
          <h5 className="card-title">Warnings</h5>
          <div>
            {[...warnings].map((warning, index) => (
              <div key={index}>
                <hr></hr>
                <div>Code Module: {warning.code_module}</div>
                <div>Code Presentation: {warning.code_presentation}</div>
                <div>Content: {warning.content}</div>
                <div>Status: {warning.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
