import React, { useState } from 'react'
import { X } from 'lucide-react'

const ChangePassword = ({ isOpen, onClose, onSubmit }) => {

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({ currentPassword, newPassword })
  }

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    onClose?.()
  }

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded w-full max-w-sm p-5'>

        <div className='flex justify-between items-center mb-5'>
          <h2 className='text-lg font-medium'>Change Password</h2>
          <button
            type='button'
            onClick={handleClose}
            aria-label='Close'
            className='text-gray-500 hover:text-gray-800 cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='currentPassword' className='text-sm font-medium'>Current Password</label>
            <input
              id='currentPassword'
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className='p-2 border border-gray-400 rounded outline-none focus:border-[#4F39F6]'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='newPassword' className='text-sm font-medium'>New Password</label>
            <input
              id='newPassword'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='p-2 border border-gray-400 rounded outline-none focus:border-[#4F39F6]'
            />
          </div>

          <button
            type='submit'
            className='bg-[#4F39F6] text-white py-2 rounded mt-2 self-end px-4'
          >
            Update Password
          </button>
        </form>

      </div>
    </div>
  )
}

export default ChangePassword