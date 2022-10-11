import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const username = sessionStorage.getItem("username");
  const token = localStorage.getItem("token");

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "current-password":
        setCurrentPassword(value);
        break;
      case "new-password":
        setNewPassword(value);
        break;
      default:
        setConfirmPassword(value);
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password does not match!");
      return;
    }

    let formData = new FormData();
    formData.append("username", username);
    formData.append("old_password", currentPassword);
    formData.append("new_password", newPassword);

    await axios
      .post("http://localhost:5000/edit-user-password", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert(response.data);
        navigate("/dashboard");
      })
      .catch((error) => alert(error.response.data));
  };

  return (
    <div>
      <nav className="ms-4 mt-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Profile
          </li>
        </ol>
      </nav>
      <div className="container">
        <div className="card m-4">
          <div className="card-body">
            <h5 className="card-title">Change Password</h5>
            <form onSubmit={handleSubmit} className="needs-validation">
              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-muted" htmlFor="password">
                    Current Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control"
                  name="current-password"
                  value={currentPassword}
                  onChange={onChange}
                  required
                  autoComplete="on"
                ></input>
                <div className="invalid-feedback">Password is required</div>
              </div>

              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-muted" htmlFor="password">
                    New Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control"
                  name="new-password"
                  value={newPassword}
                  onChange={onChange}
                  required
                  autoComplete="on"
                ></input>
                <div className="invalid-feedback">Password is required</div>
              </div>

              <div className="mb-3">
                <div className="mb-2 w-100">
                  <label className="text-muted" htmlFor="password">
                    Confirm Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                  autoComplete="on"
                ></input>
                <div className="invalid-feedback">Password is required</div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" className="btn btn-primary ms-auto">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
