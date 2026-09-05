import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import LoginLeftSide from '../components/LoginLeftSide'

const LoginLanding = () => {
  const portalOption = [
    {
      title: "Admin Portal",
      to: "/login/admin",
      description: "Welcome to Admin Portal",
      icon: ArrowRight
    },
    {
      title: "Employee Portal",
      to: "/login/employee",
      description: "Welcome to Employee Portal",
      icon: ArrowRight
    }
  ]

  return (
    <div className='flex min-h-screen'>
      <LoginLeftSide/>
      <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto min-h-screen'>
        <div className="main-content">
          <div className='mb-10'>
            <h1 className='text-4xl font-medium mb-2'>Welcome Back</h1>
            <p>Select your portal to securely access the system.</p>
          </div>
          {portalOption.map((p) => (
            <Link
              to={p.to}
              key={p.to}
              className='flex justify-between p-4 bg-[#F8FAFC] items-center'
            >
              <p>{p.title}</p>
              <p.icon className="w-5 h-5" />
            </Link>
          ))}
          <p className='mt-10'>© Izza Youcef 2026 All rights reserved</p>
        </div>
      </div>
    </div>
  )
}

export default LoginLanding