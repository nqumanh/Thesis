import React from 'react'
import './dashboard.css'
import SideBar from '../../components/UserPage/SideBar'
import Header from '../../components/UserPage/Header'
import routes from '../../routes'
import { Routes, Route } from 'react-router-dom'

export default function StudentPage () {
  return (
    <div className='App'>
      <SideBar />
      <div className='MainFrame'>
        <Header />
        <Routes>
          {routes.map((prop, key) => (
            <Route
              exact
              path={prop.path}
              element={<prop.element />}
              key={key}
            />
          ))}
        </Routes>
      </div>
    </div>
  )
}
