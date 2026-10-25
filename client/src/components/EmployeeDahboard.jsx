import React, { useState } from 'react'
import { CalendarCheck, CalendarX, DollarSign, AlignRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const EmployeeDahboard = ({ data }) => {

  const cardItems = [
    { title: "Days Present", icon: CalendarCheck, number: data.currentMonthAttendance },
    { title: "Pending Leaves", icon: CalendarX, number: data.pendingLeaves },
    { title: "Latest Payslip", icon: DollarSign, number: data.latestPayslip?.netSalary ?? 0 },
  ] 


  return (
    <div className='gap-3'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
        {cardItems.map((item) => (
          <div
            key={item.title}
            className='flex flex-1 justify-between items-center p-6 border shadow border-gray-200 border-l-4 border-l-[#62748EB2] rounded-lg'
          >
            <div className='flex flex-col gap-1'>
              <p className='font-medium text-sm text-[#314158]'>{item.title}</p>
              <h1 className='font-bold text-2xl'>{item.number}</h1>
            </div>
            <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#615FFF1F] text-[#615FFF]'>
              <item.icon size={20} />
            </div>
          </div>
         ))}
      </div>

      <div className='flex flex-wrap gap-3 mt-9'>
        <Link
          to="/attendance"
          className='flex justify-between items-center gap-2 cursor-pointer bg-[#0000FF] border rounded-md px-5 py-2.5'
        >
          <p className='text-white'>Mark Attendance</p>
          <ArrowRight className='text-white' size={16} />
        </Link>

        <Link
          to="/leave"
          className='flex justify-between items-center gap-2 cursor-pointer text-[#314158] border rounded-md px-5 py-2.5'
        >
          <p>Apply for Leave</p>
          <ArrowRight  size={16} />
        </Link>
      </div>
    </div>
  )
}

export default EmployeeDahboard