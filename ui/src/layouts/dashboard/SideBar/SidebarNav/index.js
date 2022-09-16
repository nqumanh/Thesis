import React from 'react'
import { Link } from 'react-router-dom'

import './SidebarNav.css'

export default function NavBar () {
  const links = [
    {
      name: 'Courses',
      to: '/dashboard'
      // subLink: [
      //   { name: 'Course List', to: '/dashboard' },
      //   { name: 'Assessments', to: '/dashboard' },
      //   { name: 'Material', to: '/dashboard' }
      // ]
    },
    { name: 'Profile', to: '/dashboard/profile' },
    { name: 'Warning', to: '/dashboard/warning' },
    { name: 'Message', to: '/dashboard/message' },
    { name: 'Account Settings', to: '/change-password' }
  ]
  return (
    <div className='NavBar'>
      <ul className='NavItemGroup'>
        {links.map((link, index) => (
          <div key={index}>
            <li className='NavItem'>
              <span>
                <Link className='NavLink' to={link.to}>
                  {link.name}
                </Link>
                {/* {link.subLink ? (
                  <div
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseExample'
                    aria-expanded='false'
                    aria-controls='collapseExample'
                  >
                    {link.name}
                  </div>
                ) : (
                  <Link className='NavLink' to={link.to}>
                    {link.name}
                  </Link>
                )} */}
              </span>
            </li>
            {/* <ul
              id='collapseExample'
              className='collapse'
              style={{ backgroundColor: '#051f3e' }}
            >
              {link.subLink?.map((subLink, index) => (
                <Link className='NavLink' key={index} to={subLink.to}>
                  <li style={{ marginLeft: '30px', padding: '10px 0' }}>
                    {subLink.name}
                  </li>
                </Link>
              ))}
            </ul> */}
          </div>
        ))}
      </ul>
    </div>
  )
}
