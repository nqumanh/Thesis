import React from 'react'
import './HeaderSidebar.css'
import { Link } from 'react-router-dom'

export default function HeaderSidebar () {
  return (
    <div className='HeaderSidebar'>
      <div className='HeaderLogo'>
        <Link className='Logo' to='/dashboard'>
          <img
            src='https://dms.iitd.ac.in/wp-content/uploads/2018/07/Courses.png'
            style={{ height: '100%' }}
            alt='Logo'
          ></img>
        </Link>
      </div>
      <div className='ToggleSidebar'>
        <button className='ToggleButton'>
          <span className='ToggleIcon'>
            <span
              style={{
                width: '28px',
                height: '2px',
                backgroundColor: '#ffffff'
              }}
            ></span>
            <span
              style={{
                width: '22px',
                height: '2px',
                backgroundColor: '#ffffff'
              }}
            ></span>
            <span
              style={{
                width: '28px',
                height: '2px',
                backgroundColor: '#ffffff'
              }}
            ></span>
          </span>
        </button>
      </div>
    </div>
  )
}
