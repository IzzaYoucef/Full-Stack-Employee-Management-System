import React from 'react'
import { UsersIcon, CalendarX, DollarSign } from 'lucide-react'

const AdminDashboard = ({ data }) => {

  const cardItems = [
    { title: "Total Employees", icon: UsersIcon, number: 50 },
    { title: "Pending Leave Requests", icon: CalendarX, number: 2},
    { title: "Monthly Payroll", icon: DollarSign, number: 2500 },
  ]

  return (
    <div className='flex gap-3'>
      {cardItems.map((item) => (
        <div
          key={item.title}
          className='flex justify-between items-center p-6 border border-gray-200 border-l-4 border-l-[#615FFF] rounded-lg w-60'
        >
          <div className='flex flex-col gap-1'>
            <p className='font-medium text-sm text-[#314158]'>{item.title}</p>
            <h1 className='font-bold text-2xl text-[#0F172B]'>{item.number}</h1>
          </div>
          <div className='h-10 w-10 flex items-center justify-center rounded-full bg-[#615FFF1F] text-[#615FFF]'>
            <item.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard