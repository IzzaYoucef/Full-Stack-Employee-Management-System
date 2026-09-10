import React, { useCallback, useEffect, useState } from 'react'
import { dummyAttendanceData } from '../assets/assets'
import { Calendar1Icon, TimerIcon } from 'lucide-react'
import Loading from '../components/Loading'

const Attendance = () => {

  const [attendances, setAttendances] = useState([])
  const [loading, setLoading] = useState(true)

  const cardItems = [
    { title: "Days present", icon: Calendar1Icon, number: 2 },
    { title: "Late Arrivals", icon: TimerIcon, number: 0 },
    { title: "Average work hours", icon: Calendar1Icon, number: 8.5 },
  ]

  const fetchAttendance = useCallback(async () => {
    setLoading(true)
    setAttendances(dummyAttendanceData)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  return (
    <div className='mx-5 my-7'>
      {/** Page Header */}
      <div className='w-full flex justify-between mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Attendance</h1>
          <p className='text-base font-normal text-[#62748E]'>Track your attendance record</p>
        </div>
      </div>

      {/** Cards */}
      <div className='flex gap-3 mb-6'>
        {cardItems.map((item) => (
          <div
            key={item.title}
            className='flex-1 flex justify-between items-center p-6 border shadow border-gray-200 border-l-4 border-l-[#62748EB2] rounded-lg'
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

      {/** Details table */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h1 className='font-medium text-lg mb-3'>Recent Activity</h1>

        <div className="grid grid-cols-6 gap-2 pb-2 mb-2 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
          <p>Date</p>
          <p>Check In</p>
          <p>Check Out</p>
          <p>Work Hours</p>
          <p>Day Type</p>
          <p>Status</p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          attendances.map((a, index) => (
            <div
              key={a.id ?? index}
              className='grid grid-cols-6 gap-2 items-center py-2 border-t border-gray-100 text-sm'
            >
              <p className='font-medium'>{a.date}</p>
              <p>{a.checkIn}</p>
              <p>{a.checkOut}</p>
              <p>{a.workingHours}</p>
              <p className='px-2 py-1 rounded text-[#007A55] uppercase bg-[#ECFDF5] text-xs w-fit'>{a.dayType}</p>
              <p className='px-2 py-1 rounded text-[#007A55] uppercase bg-[#ECFDF5] text-xs w-fit'>{a.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Attendance