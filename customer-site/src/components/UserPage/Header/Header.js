import React from 'react'
import './Header.css'

import DropdownNav from './DropdownNav'

export default function Header (props) {
  return (
    <div className='Header'>

      <DropdownNav userRole={props.userRole} id={props.id} />
    </div>
  )
}
