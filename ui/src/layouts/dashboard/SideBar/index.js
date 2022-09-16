import React from 'react'

import './Sidebar.css'

import HeaderSidebar from './HeaderSidebar'
import SidebarNav from './SidebarNav'

export default function Sidebar (props) {

  return (
    <div className='Sidebar'>
      <HeaderSidebar onToggle={props.onToggle}/>
      <SidebarNav />
    </div>
  )
}
