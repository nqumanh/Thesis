import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage () {
  const navigate = useNavigate()

  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')

  const onChange = e => {
    const { name, value } = e.target
    if (name === 'username') {
      setStudentId(value)
    } else {
      setPassword(value)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    let formData = new FormData()
    formData.append('username', studentId)
    formData.append('password', password)

    const requestOptions = {
      method: 'POST',
      body: formData
    }
    await fetch('http://localhost:5000/login', requestOptions)
      .then(response => {
        if (response.status === 400) throw new Error('Account does not exist!')
        if (response.status === 403) throw new Error('Wrong Password!')
        const username = formData.get('username')
        // const role =
        //   username[0] === '1'
        //     ? 'student'
        //     : username[0] === '2'
        //     ? 'parents'
        //     : 'educator'
        sessionStorage.setItem('username', username)
        alert('Login successfully!')
        // navigate(`/${role}`)
        navigate(`/dashboard`)
      })
      .catch(err => alert(err))
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
                <h1 className='fs-4 card-title fw-bold mb-4'>Login</h1>
                <form onSubmit={handleSubmit} className='needs-validation'>
                  <div className='mb-3'>
                    <label className='mb-2 text-muted' htmlFor='username'>
                      Username
                    </label>
                    <input
                      id='username'
                      type='text'
                      className='form-control'
                      name='username'
                      value={studentId}
                      onChange={onChange}
                      required
                      autoComplete='on'
                    ></input>
                    <div className='invalid-feedback'>Email is invalid</div>
                  </div>

                  <div className='mb-3'>
                    <div className='mb-2 w-100'>
                      <label className='text-muted' htmlFor='password'>
                        Password
                      </label>
                      <a href='forgot.html' className='float-end'>
                        Forgot Password?
                      </a>
                    </div>
                    <input
                      id='password'
                      type='password'
                      className='form-control'
                      name='password'
                      value={password}
                      onChange={onChange}
                      required
                      autoComplete='on'
                    ></input>
                    <div className='invalid-feedback'>Password is required</div>
                  </div>

                  <div className='d-flex justify-content-between align-items-center'>
                    <div className='form-check'>
                      <input
                        type='checkbox'
                        name='remember'
                        id='remember'
                        className='form-check-input'
                      ></input>
                      <label htmlFor='remember' className='form-check-label'>
                        Remember Me
                      </label>
                    </div>
                    <button type='submit' className='btn btn-primary ms-auto'>
                      Login
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
