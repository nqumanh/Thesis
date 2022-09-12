import React, { useState, useEffect } from 'react'

export default function Profile () {
  const [warnings, setWarnings] = useState([])

  useEffect(() => {
    let username = sessionStorage.getItem('username')
    let id = username.substring(1)
    fetch(`http://localhost:5000/warning/${id}`)
      .then(res =>
        res.json().then(data => {
          setWarnings(data)
        })
      )
      .catch(err => console(err))
  }, [])

  return (
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>Warnings</h5>
        <div>
          {[...warnings].map((warning, index) => (
            <div key={index}>
              <hr></hr>
              <div>Code_module: {warning.code_module}</div>
              <div>code_presentation: {warning.code_presentation}</div>
              <div>Content: {warning.content}</div>
              <div>Status: {warning.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
