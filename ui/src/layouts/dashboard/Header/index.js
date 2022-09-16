import React from 'react'
import './Header.css'
import DropdownNav from './DropdownNav'

export default function Header (props) {
  const displayBtn = () => {
    if (!props.toggle)
      return (
        <button className='ToggleButton' onClick={() => props.onToggle()}>
          <span className='ToggleIcon'>
            <span
              style={{
                width: '28px',
                height: '2px',
                backgroundColor: '#ffffff'
              }}
            ></span>
            <span
              style={{
                width: '22px',
                height: '2px',
                backgroundColor: '#ffffff'
              }}
            ></span>
            <span
              style={{
                width: '28px',
                height: '2px',
                backgroundColor: '#ffffff'
              }}
            ></span>
          </span>
        </button>
      )
  }
  
  return (
    <div className='Header'>
      <div className='ToggleSidebar'>{displayBtn()}</div>
      <DropdownNav />
    </div>
  )
}
