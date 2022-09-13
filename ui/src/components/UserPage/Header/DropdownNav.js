import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './DropdownNav.css'
import { BiEnvelope } from 'react-icons/bi'
import { BiBell } from 'react-icons/bi'

export default function DropdownNav () {
  const [messages, setMessages] = useState([])
  const [warnings, setWarnings] = useState([])

  const username = sessionStorage.getItem('username')
  const id = username.substring(1)
  const role =
    username.substring(0, 1) === '1'
      ? 'Student'
      : username.substring(0, 1) === '2'
      ? 'Parents'
      : 'Educator'

  useEffect(() => {
    fetch(`http://localhost:5000/message/${username}`)
      .then(res =>
        res.json().then(data => {
          setMessages(data)
        })
      )
      .catch(err => console(err))
  }, [username])

  useEffect(() => {
    fetch(`http://localhost:5000/warning/${id}`)
      .then(res =>
        res.json().then(data => {
          setWarnings(data)
        })
      )
      .catch(err => console(err))
  }, [id])

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
              {id}
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
              {role}
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
          <h6 className='dropdown-menu--title bg-warning'>{id}</h6>
          <ul className='dropdown-menu--list'>
            <li>
              <Link className='dropdown-item' to='/dashboard/profile'>
                My Profile
              </Link>
            </li>
            <li>
              <Link className='dropdown-item' to='/dashboard/security'>
                Account Settings
              </Link>
            </li>
            <li>
              <Link
                className='dropdown-item'
                to='/login'
                onClick={() => sessionStorage.clear()}
              >
                Log Out
              </Link>
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
            {Object.keys(messages).length === 0 ? (
              <span>No messages</span>
            ) : (
              [...messages].map((message, index) => (
                <li key={index}>
                  <Link
                    className='dropdown-item dropdown-menu--item d-flex flex-row'
                    to='/dashboard/message'
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
                        <strong>{message.sender_id}</strong>
                        <small>{message.created_time}</small>
                      </div>
                      <p>{message.message}</p>
                    </div>
                  </Link>
                </li>
              ))
            )}
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
            {warnings.length}
          </span>
        </a>
        <div className='dropdown-menu dropdown-menu-end mt-3 p-0'>
          <div className='dropdown-menu--title bg-danger'>
            {Object.keys(warnings).length} Warnings
          </div>
          <ul className='dropdown-menu--list'>
            {[...warnings].map((warning, index) => (
              <li key={index}>
                <Link
                  className='dropdown-item dropdown-menu--item d-flex flex-row'
                  to='/dashboard/warning'
                >
                  <div className='dropdown-menu--item--body'>
                    <div className='dropdown-menu-item--body--header'>
                      <strong>{warning.content}</strong>
                    </div>
                    <p>{warning.created_time}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  )
}
