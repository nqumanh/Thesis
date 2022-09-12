import React, { useState, useEffect } from 'react'

export default function Profile () {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const username = sessionStorage.getItem('username')
    fetch(
      `http://localhost:5000/message/${username}`
    ).then(res =>
      res.json().then(data => {
        setMessages(data)
      })
    )
  }, [])

  return (
    <div className='card'>
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
