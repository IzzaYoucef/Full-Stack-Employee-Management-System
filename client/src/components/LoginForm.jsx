import React from 'react'
import LoginLeftSide from './LoginLeftSide'
import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const LoginForm = ({ role, title, subtitle }) => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <LoginLeftSide/>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md animate-fade-in">

          <Link to='/login' className='flex items-center gap-2 text-gray-500 hover:text-gray-700 cursor-pointer mb-8 text-sm'>
            <ArrowLeftIcon size={16} /> Back to portals
          </Link>

          <h1 className='text-2xl font-semibold mb-1'>{title}</h1>
          <p className='text-gray-500 mb-8'>{subtitle}</p>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                placeholder='youcef@example.com'
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder='••••••••'
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="mt-2 bg-indigo-950 text-white rounded-md py-2 font-medium hover:bg-indigo-900 transition-colors"
            >
              Sign in
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default LoginForm