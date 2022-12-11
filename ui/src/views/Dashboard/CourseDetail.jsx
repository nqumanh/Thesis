import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function CourseDetail() {
  const location = useLocation();
  const course = location.state.presentation;
  const [materials, setMaterials] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const role = sessionStorage.getItem("role");
  const id = parseInt(sessionStorage.getItem("username").substring(1));
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:5000/materials/${course.codeModule}/${course.codePresentation}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => setMaterials(response.data))
      .catch((error) => console.log(error));
  }, [course, token]);

  useEffect(() => {
    let url = `http://127.0.0.1:5000/assessments/${course.codeModule}/${course.codePresentation}`;
    if (role === "student")
      url = `http://127.0.0.1:5000/student-assessment/${id}/${course.codeModule}/${course.codePresentation}`;
    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setAssessments(response.data))
      .catch((error) => console.log(error));
  }, [id, role, course, token]);

  const eleMaterial = materials.slice(0, 5).map((material) => (
    <tr key={material.id_site}>
      <td>{material.id_site}</td>
      <td>{material.activity_type}</td>
      <td>{material.week_from}</td>
      <td>{material.week_to}</td>
    </tr>
  ));

  const eleAssessment = assessments.map((assessment, index) => (
    <tr key={index}>
      <td>{assessment.assessment_type}</td>
      <td>{assessment.date_submitted}</td>
      <td>{assessment.score}</td>
      <td>{assessment.weight}</td>
    </tr>
  ));

  return (
    <div className="card m-4">
      <div className="card-body">
        <a className="card-title" data-bs-toggle="collapse" href="#courseInfomation" role="button" aria-expanded="false" aria-controls="courseInfomation" style={{ textDecoration: "none", color: "#000", fontSize: "40px" }}>
          Course Information
        </a>
        <div className="collapse ps-3 show" id="courseInfomation">
          <div>Course Name: {course.name}</div>
          <div>Major: {course.major}</div>
          <div>Year: {course.year}</div>
          <div>Starting Month: {course.monthStart}</div>
          <div>Course Length (day): {course.length}</div>
          <div>Number of students: {course.studentCount}</div>
        </div>

        <hr></hr>

        <a data-bs-toggle="collapse" href="#materialTable" role="button" aria-expanded="false" aria-controls="materialTable" style={{ textDecoration: "none", color: "#000", fontSize: "40px" }}>
          Material
        </a>
        <table className="table table-bordered collapse show" id="materialTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Activity Type</th>
              <th>Week from</th>
              <th>Week to</th>
            </tr>
          </thead>
          <tbody>{eleMaterial}</tbody>
        </table>

        <a data-bs-toggle="collapse" href="#assessmentTable" role="button" aria-expanded="false" aria-controls="assessmentTable" style={{ textDecoration: "none", color: "#000", fontSize: "40px" }}>
          Assessment
        </a>
        <table className="table table-bordered collapse show" id="assessmentTable">
          <thead>
            <tr>
              <th>Assessment Type</th>
              <th>Date Submitted</th>
              <th>Score</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>{eleAssessment}</tbody>
        </table>
      </div>
    </div >
  );
}
