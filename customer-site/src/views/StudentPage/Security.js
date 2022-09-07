import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Security () {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const pathname = location.pathname
  const pathArr = pathname.split('/')
  pathArr.pop()
  const allCoursesPath = pathArr.join('/')

  const onChange = e => {
    const { name, value } = e.target
    switch (name) {
      case 'current-password':
        setCurrentPassword(value)
        break
      case 'new-password':
        setNewPassword(value)
        break
      default:
        setConfirmPassword(value)
        break
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Password does not match!')
      return
    }
    const isCorrectPassword = true
    if (!isCorrectPassword) {
      alert('Current Password is not correct!')
      return
    }
    alert('Password Changed!')
    navigate(allCoursesPath)
  }

  return (
    <section className='h-100'>
      <div className='container h-100'>
        <div className='row justify-content-sm-center h-100'>
          <div className='col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9'>
            <div className='text-center my-5'>
              <img
                src='https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg'
                alt='logo'
                width='100'
              ></img>
            </div>
            <div className='card shadow-lg'>
              <div className='card-body p-5'>
                <h1 className='fs-4 card-title fw-bold mb-4'>
                  Change Password
                </h1>
                <form onSubmit={handleSubmit} className='needs-validation'>
                  <div className='mb-3'>
                    <div className='mb-2 w-100'>
                      <label className='text-muted' htmlFor='password'>
                        Current Password
                      </label>
                    </div>
                    <input
                      type='password'
                      className='form-control'
                      name='current-password'
                      value={currentPassword}
                      onChange={onChange}
                      required
                      autoComplete='on'
                    ></input>
                    <div className='invalid-feedback'>Password is required</div>
                  </div>

                  <div className='mb-3'>
                    <div className='mb-2 w-100'>
                      <label className='text-muted' htmlFor='password'>
                        Current Password
                      </label>
                    </div>
                    <input
                      type='password'
                      className='form-control'
                      name='new-password'
                      value={newPassword}
                      onChange={onChange}
                      required
                      autoComplete='on'
                    ></input>
                    <div className='invalid-feedback'>Password is required</div>
                  </div>

                  <div className='mb-3'>
                    <div className='mb-2 w-100'>
                      <label className='text-muted' htmlFor='password'>
                        Current Password
                      </label>
                    </div>
                    <input
                      type='password'
                      className='form-control'
                      name='confirm-password'
                      value={confirmPassword}
                      onChange={onChange}
                      required
                      autoComplete='on'
                    ></input>
                    <div className='invalid-feedback'>Password is required</div>
                  </div>

                  <div className='d-flex justify-content-between align-items-center'>
                    <button type='submit' className='btn btn-primary ms-auto'>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
