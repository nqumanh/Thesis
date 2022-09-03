import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage () {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')

  const onChange = e => {
    const { name, value } = e.target
    if (name === 'email') {
      setStudentId(value)
    } else {
      setPassword(value)
    }
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
                <form className='needs-validation'>
                  <div className='mb-3'>
                    <label className='mb-2 text-muted' htmlFor='email'>
                      E-Mail Address
                    </label>
                    <input
                      id='email'
                      type='email'
                      className='form-control'
                      name='email'
                      value={studentId}
                      onChange={onChange}
                      required
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
                    <Link to={`/student/${studentId}`}>
                      <button type='submit' className='btn btn-primary ms-auto'>
                        Login
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    // <form>
    //   <div className='form-outline mb-4'>
    //     <input
    //       name='email'
    //       type='email'
    //       id='form2Example1'
    //       className='form-control'
    //       value={studentId}
    //       onChange={onChange}
    //     />
    //     <label className='form-label' htmlFor='form2Example1'>
    //       Email address
    //     </label>
    //   </div>

    //   <div className='form-outline mb-4'>
    //     <input
    //       name='password'
    //       type='password'
    //       id='form2Example2'
    //       className='form-control'
    //       autoComplete='on'
    //     />
    //     <label className='form-label' htmlFor='form2Example2'>
    //       Password
    //     </label>
    //   </div>

    //   <div className='row mb-4'>
    //     <div className='col d-flex justify-content-center'>
    //       <div className='form-check'>
    //         <input
    //           className='form-check-input'
    //           type='checkbox'
    //           value={password}
    //           id='form2Example31'
    //           checked
    //           onChange={onChange}
    //         />
    //         <label className='form-check-label' htmlFor='form2Example31'>
    //           {' '}
    //           Remember me{' '}
    //         </label>
    //       </div>
    //     </div>

    //     <div className='col'>
    //       <a href='#!'>Forgot password?</a>
    //     </div>
    //   </div>

    //   <Link to={`/student/${studentId}`}>
    //     <button type='submit' className='btn btn-primary btn-block mb-4'>
    //       Sign in
    //     </button>
    //   </Link>
    //   {/* <input
    //     name='username'
    //     type='text'
    //     value={studentId}
    //     onChange={onChange}
    //   ></input>
    //   <input name='password' type='password' autoComplete='on'></input>

    //   <button type='submit'>Login</button> */}
    // </form>
  )
}
