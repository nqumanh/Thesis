import React from 'react'
import { Link } from 'react-router-dom'

import './SidebarNav.css'

export default function NavBar () {
  const links = [
    { name: 'Courses', to: '/dashboard' },
    { name: 'Profile', to: '/dashboard/profile' },
    { name: 'Warning', to: '/dashboard/warning' },
    { name: 'Message', to: '/dashboard/message' },
    { name: 'Security', to: '/dashboard/security' }
  ]
  return (
    <div className='NavBar'>
      <ul className='NavItemGroup'>
        {[...links].map((link, index) => (
          <li className='NavItem' key={index}>
            <span>
              <Link className='NavLink' to={link.to}>
                {link.name}
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
