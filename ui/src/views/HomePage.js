import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage () {
  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '1000px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: '60px',
          backgroundColor: '#fff'
        }}
      >
        <div
          className='container'
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            height: '80',
            alignItems: 'center'
          }}
        >
          <Link to='/login'>
            <button
              type='button'
              className='btn btn-light text-primary'
              style={{ border: '1px solid blue' }}
            >
              Login
            </button>
          </Link>
        </div>
      </header>

      <br></br>
      <br></br>
      <div className='container'>
        <h1 style={{ marginBottom: '50px' }}>Warning System</h1>
        <p style={{ display: 'block', width: '50%', marginBottom: '50px' }}>
          Warning system is any system of biological or technical nature
          deployed by an individual or group to inform of a future danger. Its
          purpose is to enable the deployer of the warning system to prepare for
          the danger and act accordingly to mitigate or avoid it. lorem ipsum
          dolor sit centimeter, consectetur azure 2630284.
        </p>
      </div>
    </div>
  )
}
