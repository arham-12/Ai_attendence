import React from 'react'
import ParentComponent from './setttings_navbar'
import { Outlet } from 'react-router-dom'

const Settings = () => {
  return (
    <div className='flex flex-col w-full mt-5' >
    <ParentComponent/>
    <Outlet/>
    </div>
  )
}

export default Settings
