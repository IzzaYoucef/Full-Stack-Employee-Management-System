import React, { useState } from 'react'
import LoginLeftSide from './LoginLeftSide'
import { ArrowLeftIcon, EyeClosedIcon, EyeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const LoginForm = ({ role, title, subtitle }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log({ role, email, password }) // replace with real auth call
  }

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

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='youcef@example.com'
                required
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosedIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
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