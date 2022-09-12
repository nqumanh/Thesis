import React, { useState, useEffect } from 'react'

export default function Profile () {
  const [messages, setMessages] = useState([])

  const username = sessionStorage.getItem('username')

  useEffect(() => {
    fetch(`http://localhost:5000/message/${username}`)
      .then(res =>
        res.json().then(data => {
          setMessages(data)
        })
      )
      .catch(err => console(err))
  }, [username])

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
                    <li className="list-group-item" key={index}>{message.sender_id}</li>
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
                    <li className="list-group-item" key={index}>{message.message}</li>
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
