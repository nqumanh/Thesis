import React from 'react'
import './SidebarNav.css'

export default function NavBar () {
  return (
    <div className='NavBar'>
      <ul className='NavItemGroup'>
        <li className='NavItem'>
          <span>
            <a className='NavLink' href='/#'>
              Courses
            </a>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <a className='NavLink' href='/#'>
              Assessments
            </a>
          </span>
        </li>
      </ul>
    </div>
  )
}
