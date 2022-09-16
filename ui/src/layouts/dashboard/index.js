import React, { useState } from 'react'
import './dashboard.css'
import SideBar from './SideBar'
import Header from './Header'
import routes from 'routes'
import { Routes, Route } from 'react-router-dom'

export default function Dashboard () {
  const [toggle, setToggle] = useState(true)
  const onToggle = () => {
    setToggle(!toggle)
  }
  const displaySideBar = () => {
    if (toggle) return <SideBar onToggle={onToggle} />
  }
  return (
    <div className='App'>
      {displaySideBar()}
      <div className='MainFrame'>
        <Header onToggle={onToggle} toggle={toggle}/>
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
