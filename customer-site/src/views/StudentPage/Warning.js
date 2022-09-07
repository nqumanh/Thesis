import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Profile () {
  const location = useLocation()
  // const [profile, setProfile] = useState([])

  const pathname = location.pathname
  const pathArr = pathname.split('/')
  pathArr.pop()
  const allCoursesPath = pathArr.join('/')


  return (
    <div className='card'>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href={allCoursesPath}>All Courses</a>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Warning
          </li>
        </ol>
      </nav>
      <div className='card-body'>
        <h5 className='card-title'>Warnings</h5>
        {/* <div>ID: {profile.id_student}</div> */}
      </div>
    </div>
  )
}
