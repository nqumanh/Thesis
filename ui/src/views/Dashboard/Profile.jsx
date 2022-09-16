import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState([]);
  const [parentsInfo, setParentsInfo] = useState([]);

  useEffect(() => {
    let username = sessionStorage.getItem("username");
    let id = parseInt(username.substring(1));
    axios
      .get(`http://127.0.0.1:5000/student/${id}`)
      .then((response) => setProfile(response.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/parents/${profile.parents_id}`)
      .then((response) => setParentsInfo(response.data))
      .catch((error) => console.log(error));
  }, [profile]);

  return (
    <div className="card m-4">
      <div className="card-body">
        <h5 className="card-title">My Profile</h5>
        <div>ID: {profile.id_student}</div>
        <div>Gender: {profile.gender}</div>
        <div>Region: {profile.region}</div>
        <div>Highest Education: {profile.highest_education}</div>
        <div>IMD band: {profile.imd_band}</div>
        <div>Disability: {profile.disability === "N" ? "No" : "Yes"}</div>
        <hr></hr>

        <h6 className="card-title">Parents</h6>
        <div>Name: {parentsInfo.name}</div>
        <div>Relationship with parent: {profile.relationship_with_parents}</div>
        <div>Personal ID: {parentsInfo.personal_id}</div>
        <div>Gender: {parentsInfo.gender}</div>
        <div>Highest Education: {parentsInfo.highest_education}</div>
        <div>Job: {parentsInfo.job}</div>
        <div>Date Of Birth: {parentsInfo.date_of_birth}</div>
        <div>Email: {parentsInfo.email}</div>
        <div>Phone Number: {parentsInfo.phone_number}</div>
        <div>Language: {parentsInfo.language}</div>
        <div>Region: {parentsInfo.region}</div>
      </div>
    </div>
  );
}
