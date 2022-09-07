import React from 'react'
import { useLocation } from 'react-router-dom'

import './SidebarNav.css'

export default function NavBar () {
  const location = useLocation()

  return (
    <div className='NavBar'>
      <ul className='NavItemGroup'>
        <li className='NavItem'>
          <span>
            <a className='NavLink' href={location.pathname}>
              Courses
            </a>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <a className='NavLink' href={location.pathname + '/profile'}>
              My Profile
            </a>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <a className='NavLink' href={location.pathname + '/message'}>
              Message
            </a>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <a className='NavLink' href={location.pathname + '/warning'}>
              Warning
            </a>
          </span>
        </li>
      </ul>
    </div>
  )
}
