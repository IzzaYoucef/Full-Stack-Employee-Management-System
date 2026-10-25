import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import SideBar from '../components/SideBar'

const Layout = () => {
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />

  return (
    <div className='flex flex-col md:flex-row h-dvh bg-gradient-to-br from-slate-50 via-white to-indigo-50/30'>
        <SideBar/>
        <main className='flex-1 min-h-0 min-w-0 overflow-y-auto'>
          <Outlet/>
        </main>
    </div>
  )
}

export default Layout