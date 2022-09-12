import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function CourseDetail () {
  const location = useLocation()
  const course = location.state.presentation
  const [materials, setMaterials] = useState([])
  const [assessments, setAssessments] = useState([])

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/materials/${course.codeModule}/${course.codePresentation}`
    ).then(res =>
      res.json().then(data => {
        setMaterials(data)
      })
    )
  }, [course])

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/assessments/${course.codeModule}/${course.codePresentation}`
    ).then(res =>
      res.json().then(data => {
        setAssessments(data)
      })
    )
  }, [course])

  const eleMaterial = materials.slice(0, 5).map(material => (
    <tr key={material.id_site}>
      <td>{material.id_site}</td>
      <td>{material.activity_type}</td>
      <td>{material.week_from}</td>
      <td>{material.week_to}</td>
    </tr>
  ))

  const eleAssessment = assessments.map(assessment => (
    <tr key={assessment.id_assessment}>
      <td>{assessment.id_assessment}</td>
      <td>{assessment.assessment_type}</td>
      <td>{assessment.date}</td>
      <td>{assessment.weight}</td>
    </tr>
  ))

  return (
    <div className='card'>
      <div className='card-body'>
        <h3 className='card-title'>Course Information</h3>
        <div>Course Name: {course.name}</div>
        <div>Major: {course.major}</div>
        <div>Year: {course.year}</div>
        <div>The month the course start: {course.monthStart}</div>
        <div>The length of the course (day): {course.length}</div>
        <div>Number of students: {course.studentCount}</div>

        <hr></hr>

        <h3>Material</h3>
        <table className='table table-bordered'>
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
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Assessment Type</th>
              <th>Date</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>{eleAssessment}</tbody>
        </table>
      </div>
    </div>
  )
}
