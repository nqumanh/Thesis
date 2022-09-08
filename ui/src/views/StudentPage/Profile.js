import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Profile () {
  const location = useLocation()
  const [profile, setProfile] = useState([])
  const [parentsInfo, setParentsInfo] = useState([])

  const pathname = location.pathname
  const pathArr = pathname.split('/')
  pathArr.pop()
  const studentId = pathArr[2]
  const allCoursesPath = pathArr.join('/')

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/student/${studentId}/profile`).then(res =>
      res
        .json()
        .then(data => {
          setProfile(data)
        })
    )
  }, [studentId])

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/parents/${profile.parents_id}`).then(res =>
      res
        .json()
        .then(data => {
          setParentsInfo(data)
        })
    )
  }, [profile])

  return (
    <div className='card'>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href={allCoursesPath}>All Courses</a>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Profile
          </li>
        </ol>
      </nav>
      <div className='card-body'>
        <h5 className='card-title'>My Profile</h5>
        <div>ID: {profile.id_student}</div>
        <div>Gender: {profile.gender}</div>
        <div>Region: {profile.region}</div>
        <div>Highest Education: {profile.highest_education}</div>
        <div>IMD band: {profile.imd_band}</div>
        <div>Disability: {profile.disability === 'N' ? 'No' : 'Yes'}</div>
        <hr></hr>

        <h6 className='card-title'>Parents</h6>
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
  )
}
