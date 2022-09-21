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

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:5000/materials/${course.codeModule}/${course.codePresentation}`
      )
      .then((response) => setMaterials(response.data))
      .catch((error) => console.log(error));
  }, [course]);

  useEffect(() => {
    let url = `http://127.0.0.1:5000/assessments/${course.codeModule}/${course.codePresentation}`;
    if (role === "student")
      url = `http://127.0.0.1:5000/student-assessment/${id}/${course.codeModule}/${course.codePresentation}`;
    axios
      .get(url)
      .then((response) => setAssessments(response.data))
      .catch((error) => console.log(error));
  }, [id, role, course]);

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

  const displayAvgPoint = () => {
    if (role === "student")
      return (
        <h5 style={{ textAlign: "right" }}>
          Average Point:{" "}
          {assessments.reduce(
            (avg, ass) => avg + parseInt(ass.score * ass.weight) / 100 / 2,
            0
          )}
        </h5>
      );
  };

  return (
    <div className="card m-4">
      <div className="card-body">
        <h3 className="card-title">Course Information</h3>
        <div>Course Name: {course.name}</div>
        <div>Major: {course.major}</div>
        <div>Year: {course.year}</div>
        <div>The month the course start: {course.monthStart}</div>
        <div>The length of the course (day): {course.length}</div>
        <div>Number of students: {course.studentCount}</div>

        <hr></hr>

        <h3>Material</h3>
        <table className="table table-bordered">
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

        <h3>Assessment</h3>
        <table className="table table-bordered">
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
        {displayAvgPoint()}
      </div>
    </div>
  );
}
