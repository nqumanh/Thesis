import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BiEnvelope } from 'react-icons/bi'
import { BiBell } from 'react-icons/bi'
import { TbLogout } from 'react-icons/tb'
import { FiSettings } from 'react-icons/fi'
import axios from 'axios'
import './DropdownNav.css'

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function DropdownNav () {
  const [name, setName] = useState('')
  const [messages, setMessages] = useState([])
  const [warnings, setWarnings] = useState([])
  const token = localStorage.getItem('token')

  const username = sessionStorage.getItem('username')
  const id = parseInt(username.substring(1))
  const role = capitalizeFirstLetter(sessionStorage.getItem('role'))

  useEffect(() => {
    axios
      .get(`http://localhost:5000/message/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setMessages(response.data))
      .catch(error => console.log(error))
  }, [username, token])

  useEffect(() => {
    axios
      .get(`http://localhost:5000/warning/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setWarnings(response.data))
      .catch(error => console.log(error))
  }, [id, token])

  useEffect(() => {
    let url = `http://localhost:5000/get-educator-name/${username}`
    if (role === 'Student') {
      url = `http://localhost:5000/get-student-name/${username}`
    }
    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setName(response.data.name))
      .catch(error => console.log(error))
  }, [username, role, token])

  let contacts = messages.map(message => {
    if (username === message.sender_id)
      return {
        name: message.receiver_id,
        sender: 'You: ',
        message: message.message,
        created_time: message.created_time
      }
    return {
      name: message.sender_id,
      sender: '',
      message: message.message,
      created_time: message.created_time
    }
  })
  let unique = new Map()
  for (let i = 0; i < contacts.length; i++) {
    unique.set(contacts[i].name, contacts[i])
  }
  contacts = [...unique.values()]

  return (
    <ul className='DropdownList'>
      <li className='header-nav__user'>
        <Link style={{ textDecoration: 'none' }} to='/dashboard/profile'>
          <div className='d-flex'>
            <div className='UserInfo'>
              <span
                style={{
                  margin: '0',
                  font: '15px Roboto, sans-serif',
                  color: '#111111',
                  display: 'inline',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }}
                className='text-truncate'
              >
                {name}
              </span>
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
          </div>
        </Link>
      </li>

      <li className='DropdownMessage'>
        <a
          href='/#'
          className='DropdownToggle position-relative'
          data-bs-toggle='dropdown'
        >
          <BiEnvelope />
          <span className='position-absolute top-0 start-100 translate-middle badge border border-light rounded-pill bg-success message-count'>
            {contacts.length}
          </span>
        </a>
        <div className='dropdown-menu dropdown-menu-end mt-4 p-0'>
          <div className='dropdown-menu--title bg-success'>
            {contacts.length} Messages
          </div>
          <ul className='dropdown-menu--list'>
            {Object.keys(contacts).length === 0 ? (
              <div className='text-center'>No messages</div>
            ) : (
              contacts.map((contact, index) => (
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
                        <strong>{contact.name}</strong>
                        <small>{contact.created_time}</small>
                      </div>
                      <p>
                        {contact.sender}
                        {contact.message}
                      </p>
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
            {Object.keys(warnings).length === 0 ? (
              <div className='text-center'>No warnings</div>
            ) : (
              [...warnings].map((warning, index) => (
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
              ))
            )}
          </ul>
        </div>
      </li>

      <li className='dropdown-setting'>
        <Link className='d-flex' to='/change-password'>
          <FiSettings />
        </Link>
      </li>

      <li className='dropdown-logout'>
        <Link
          style={{ display: 'flex' }}
          to='/login'
          onClick={() => {
            sessionStorage.clear()
            localStorage.clear()
          }}
        >
          <TbLogout />
        </Link>
      </li>
    </ul>
  )
}
