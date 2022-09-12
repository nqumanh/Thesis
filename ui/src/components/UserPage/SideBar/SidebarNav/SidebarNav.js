import React from 'react'
import { Link } from 'react-router-dom'

import './SidebarNav.css'

export default function NavBar () {
  return (
    <div className='NavBar'>
      <ul className='NavItemGroup'>
        <li className='NavItem'>
          <span>
            <Link className='NavLink' to='/dashboard'>
              Courses
            </Link>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <Link className='NavLink' to='/dashboard/profile'>
              Profile
            </Link>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <Link className='NavLink' to='/dashboard/warning'>
              Warning
            </Link>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <Link className='NavLink' to='/dashboard/message'>
              Message
            </Link>
          </span>
        </li>
        <li className='NavItem'>
          <span>
            <Link className='NavLink' to='/dashboard/security'>
              Security
            </Link>
          </span>
        </li>
      </ul>
    </div>
  )
}
