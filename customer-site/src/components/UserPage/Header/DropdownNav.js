import React from 'react'
import './DropdownNav.css'
import { BiEnvelope } from 'react-icons/bi'
import { BiBell } from 'react-icons/bi'

export default function DropdownNav (props) {
  return (
    <ul className='DropdownList'>
      <li className='DropdownUser dropdown'>
        <a
          className='DropdownToggle dropdown-toggle--user'
          href='/#'
          data-bs-toggle='dropdown'
        >
          <div className='UserInfo'>
            <h5
              style={{
                margin: '0',
                font: '15px Roboto, sans-serif',
                color: '#111111',
                display: 'flex',
                justifyContent: 'flex-end',
                flex: '1',
                fontWeight: 'bold'
              }}
            >
              {props.id}
            </h5>
            <span
              style={{
                color: '#646464',
                font: '13px Roboto, sans-serif',
                display: 'flex',
                justifyContent: 'flex-end',
                flex: '1'
              }}
            >
              {props.userRole}
            </span>
          </div>
          <div className='UserAvatar'>
            <img
              style={{ borderRadius: '100%' }}
              src='https://www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/img/figure/admin.jpg'
              alt='avatar'
            ></img>
          </div>
        </a>
        <ul className='dropdown-menu'>
          <li>
            <a className='dropdown-item' href='#/profile'>
              My Profile
            </a>
          </li>
          <li>
            <a className='dropdown-item' href='#ChangePassword'>
              Account Settings
            </a>
          </li>
          <li>
            <a className='dropdown-item' href='/login'>
              Log Out
            </a>
          </li>
        </ul>
      </li>

      <li className='DropdownMessage'>
        <a
          href='/#'
          className='DropdownToggle position-relative'
          data-bs-toggle='dropdown'
        >
          <BiEnvelope />
          <span className='position-absolute top-0 start-100 translate-middle badge border border-light rounded-pill bg-danger noti-count'>
            5+
          </span>
        </a>
        <ul className='dropdown-menu'>
          <li>
            <a className='dropdown-item' href='#mess1'>
              First Message 
            </a>
          </li>
          <li>
            <a className='dropdown-item' href='#mess2'>
              Second Message
            </a>
          </li>
        </ul>
      </li>

      <li className='DropdownNotification'>
        <a href='/#' className='DropdownToggle position-relative' data-bs-toggle='dropdown'>
          <BiBell />
        </a>
        <ul className='dropdown-menu'>
          <li>
            <a className='dropdown-item' href='#noti1'>
              First Notification
            </a>
          </li>
          <li>
            <a className='dropdown-item' href='#noti2'>
              Second Notification
            </a>
          </li>
        </ul>
      </li>
    </ul>
  )
}
