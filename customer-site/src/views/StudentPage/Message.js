import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Profile () {
  const location = useLocation()
  const [messages, setMessages] = useState([])

  const pathname = location.pathname
  const pathArr = pathname.split('/')
  pathArr.pop()
  // const studentId = pathArr[2]
  const allCoursesPath = pathArr.join('/')

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
    <div className='card'>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href={allCoursesPath}>All Courses</a>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Message
          </li>
        </ol>
      </nav>
      <div className='container'>
        <div className='row'>
          <div className='col-3 p-0'>
            <div className='card'>
              <div className='card-body'>
                <h5 className='card-title'>Conversation</h5>
                <ul className='list-group list-group-flush'>
                  {[...messages].map((message, index) => (
                    <li className="list-group-item" key={index}>{message.code_module}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='col-9 p-0'>
            <div className='card'>
              <div className='card-body'>
                <ul className='list-group list-group-flush'>
                  {[...messages].map((message, index) => (
                    <li className="list-group-item" key={index}>{message.content}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
