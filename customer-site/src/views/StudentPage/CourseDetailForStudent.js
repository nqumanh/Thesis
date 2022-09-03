import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function CourseDetailForStudent () {
  const location = useLocation()
  const [materials, setMaterials] = useState([])
  const [assessments, setAssessments] = useState([])

  const course = location.state.presentation
  const pathname = location.pathname
  const pathArr = pathname.split("/")
  pathArr.pop()
  const allCoursesPath = pathArr.join('/')

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/materials/${course.codeModule}/${course.codePresentation}`
    ).then(res =>
      res.json().then(data => {
        setMaterials(data)
      })
    )
  }, [])

  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/assessments/${course.codeModule}/${course.codePresentation}`
    ).then(res =>
      res.json().then(data => {
        setAssessments(data)
      })
    )
  }, [])

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
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href={allCoursesPath}>All Courses</a>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            {course.name}
          </li>
        </ol>
      </nav>
      <div className='card-body'>
        <h5 className='card-title'>Course Infomation</h5>
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
