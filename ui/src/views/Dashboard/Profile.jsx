import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let username = sessionStorage.getItem("username");
    let id = parseInt(username.substring(1));
    axios
      .get(`http://127.0.0.1:5000/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProfile(response.data))
      .catch((error) => console.log(error));
  }, [token]);

  return (
    <div>
      <nav className="ms-4 mt-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">
            Profile
          </li>
        </ol>
      </nav>
      <div className="card m-4">
        <div className="card-body d-flex justify-content-between">
          <div>
            <h5 className="card-title">Personal Information</h5>
            <div>ID: {profile.id_student}</div>
            <div>Gender: {profile.gender}</div>
            <div>Region: {profile.region}</div>
            <div>Highest Education: {profile.highest_education}</div>
          </div>
          <div>Avatar</div>
        </div>
      </div>
    </div>
  );
}
