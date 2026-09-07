import React, { useCallback, useEffect, useState } from 'react'
import { dummyEmployeeData } from '../assets/assets'
import { PlusIcon, SearchIcon } from 'lucide-react'

const Employees = () => {

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEmployeesData = useCallback(async () => {
    setLoading(true)
    setEmployees(dummyEmployeeData)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    fetchEmployeesData()
  }, [fetchEmployeesData])

  return (
    <div className='mx-5 my-7'>
      {/** Header */}
      <div className='w-full flex justify-between mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Employees</h1>
          <p className='text-base font-normal text-[#62748E]'>Manage your team members</p>
        </div>
        <button
          type="button"
          className='flex items-center gap-2 py-2.5 px-4 rounded-md bg-indigo-950 text-white cursor-pointer'
        >
          <PlusIcon color='white' size={16} />
          <p className='text-sm font-normal'>Add Employee</p>
        </button>
      </div>

      {/** Search Bar */}
      <div className="relative w-full mb-5">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees"
          className='w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5'
        />
      </div>

      {/** Employees */}
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <span className='h-8 w-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin'></span>
        </div>
      ) : (
        <div className='flex flex-wrap gap-4'>
          {employees.map((em) => (
            <div
              key={em.id ?? `${em.firstName}-${em.lastName}`}
              className='w-56 p-4 rounded-lg border border-gray-200 bg-white'
            >
              <header className='text-sm text-gray-500 mb-3'>
                {em.position}
              </header>
              <div className='h-16 w-16 rounded-full flex items-center justify-center bg-[#F1F5F9] mx-auto mb-3'>
                <span className='uppercase text-[#432DD7] font-semibold'>
                  {em.firstName?.charAt(0)}{em.lastName?.charAt(0)}
                </span>
              </div>
              <div className='flex flex-col items-center text-center gap-1'>
                <h1 className='text-base font-medium'>{em.firstName} {em.lastName}</h1>
                <p className='text-sm text-gray-500'>{em.department}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Employees