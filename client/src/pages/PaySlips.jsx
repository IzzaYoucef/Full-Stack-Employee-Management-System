import React, { useCallback, useEffect, useState } from 'react'
import { dummyPayslipData } from '../assets/assets'
import { DownloadIcon, PlusIcon } from 'lucide-react'

const PaySlips = () => {
  const [loading, setLoading] = useState(true)
  const [paySlips, setPaySlips] = useState([])

  const fetchPaySlips = useCallback(async () => {
    setLoading(true)
    setPaySlips(dummyPayslipData)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => { 
    fetchPaySlips()
  }, [])

  const elementsToDisplay = ['period', 'basic salary', 'net salary', 'action']

  return (
    <div className='mx-5 my-7'>
      {/* Header */}
      <div className='w-full flex justify-between mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Payslips</h1>
          <p className='text-base font-normal text-[#62748E]'>Your payslip history</p>
        </div>
        <button
          type='button'
          className='flex items-center gap-2 px-2 h-10 rounded-md bg-[#4F39F6] text-white cursor-pointer'
        >
          <PlusIcon size={16} />
          <p className='text-sm font-normal'>Add Employee</p>
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <span className='h-8 w-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin'></span>
        </div>
      ) : (
        <div className='border border-gray-200 rounded p-2'>
          {/* Header row */}
          <div className='grid grid-cols-4 items-center'>
            {elementsToDisplay.map((element, index) => (
              <p key={index} className='capitalize text-gray-500 font-bold'>
                {element}
              </p>
            ))}
          </div>

          {/* Data rows */}
          {paySlips.map((p, index) => (
            <div
              key={index}
              className='grid grid-cols-4 items-center py-2 border-t border-gray-100'
            >
              <p className='capitalize text-gray-700 font-semibold'>
                {p.month}/{p.year}
              </p>
              <p className='capitalize text-gray-700 font-semibold'>${p.basicSalary}</p>
              <p className='capitalize text-gray-700 font-semibold'>${p.netSalary}</p>
              <button
                type='button'
                className='flex items-center gap-2 p-2 bg-gray-100 text-blue-600 justify-center rounded cursor-pointer'
              >
                <DownloadIcon size={16} />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PaySlips