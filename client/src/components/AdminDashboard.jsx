import React from 'react'
import { UsersIcon, CalendarX, DollarSign, CalendarRangeIcon, PaperclipIcon, Building2Icon } from 'lucide-react'
import { DEPARTMENTS } from '../assets/assets'

const AdminDashboard = ({ data }) => {

  const cardItems = [
    { title: "Total Employees", icon: UsersIcon, number: data.totalEmployees },
    { title: "Departements", icon: Building2Icon, number: DEPARTMENTS.length },
    { title: "Today's attendance", icon: CalendarRangeIcon, number: data.todayAttendances }, 
    { title: "Pending Leaves", icon: PaperclipIcon , number: data.pendingLeaves }, 
  ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {cardItems.map((item) => (
        <div
          key={item.title}
          className='flex flex-1 justify-between items-center p-6 border border-gray-500 border-l-4 border-l-[#615FFF] rounded-lg '
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