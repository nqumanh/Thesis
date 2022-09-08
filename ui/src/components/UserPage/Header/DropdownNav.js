import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import './DropdownNav.css'
import { BiEnvelope } from 'react-icons/bi'
import { BiBell } from 'react-icons/bi'

export default function DropdownNav (props) {
  const location = useLocation()

  const [messages, setMessages] = useState([])
  const warning = ['First Warning', 'Second Warning']

  useEffect(() => {
    fetch(
      `http://localhost:5000/message/69ade80a-1256-4d96-8e3f-0b0d24aade57`
    ).then(res =>
      res.json().then(data => {
        setMessages(data)
      })
    )
  }, [])

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
        <div className='dropdown-menu dropdown-menu-end mt-1 p-0'>
          <h6 className='dropdown-menu--title bg-warning'>{props.id}</h6>
          <ul className='dropdown-menu--list'>
            <li>
              <a
                className='dropdown-item'
                href={location.pathname + '/profile'}
              >
                My Profile
              </a>
            </li>
            <li>
              <a
                className='dropdown-item'
                href={location.pathname + '/security'}
              >
                Account Settings
              </a>
            </li>
            <li>
              <a className='dropdown-item' href='/login'>
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </li>

      <li className='DropdownMessage'>
        <a
          href='/#'
          className='DropdownToggle position-relative'
          data-bs-toggle='dropdown'
        >
          <BiEnvelope />
          <span className='position-absolute top-0 start-100 translate-middle badge border border-light rounded-pill bg-success message-count'>
            {messages.length}
          </span>
        </a>
        <div className='dropdown-menu dropdown-menu-end mt-4 p-0'>
          <div className='dropdown-menu--title bg-success'>
            {messages.length} Messages
          </div>
          <ul className='dropdown-menu--list'>
            {[...messages].map((message, index) => (
              <li key={index}>
                <a
                  className='dropdown-item dropdown-menu--item d-flex flex-row'
                  href={location.pathname + '/message'}
                >
                  <div className='UserAvatar'>
                    <img
                      style={{ borderRadius: '100%' }}
                      src='https://www.radiustheme.com/demo/html/psdboss/akkhor/akkhor/img/figure/admin.jpg'
                      alt='avatar'
                    ></img>
                  </div>
                  <div className='dropdown-menu--item--body'>
                    <div className='dropdown-menu-item--body--header'>
                      <strong>{message.code_module}</strong>
                      <small>{message.created_time}</small>
                    </div>
                    <p>{message.content}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>

      <li className='DropdownNotification'>
        <a
          href='/#'
          className='DropdownToggle position-relative'
          data-bs-toggle='dropdown'
        >
          <BiBell />
          <span className='position-absolute top-9 start-100 translate-middle badge border border-light rounded-pill bg-danger noti-count'>
            {warning.length}
          </span>
        </a>
        <div className='dropdown-menu dropdown-menu-end mt-3 p-0'>
          <div className='dropdown-menu--title bg-danger'>
            {warning.length} Warnings
          </div>
          <ul className='dropdown-menu--list'>
            {[...warning].map((noti, index) => (
              <li key={index}>
                <a
                  className='dropdown-item dropdown-menu--item d-flex flex-row'
                  href={location.pathname + '/warning'}
                >
                  <div className='dropdown-menu--item--body'>
                    <div className='dropdown-menu-item--body--header'>
                      <strong>{noti}</strong>
                    </div>
                    <p>8:00</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  )
}
