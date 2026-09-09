import React, { useCallback, useEffect, useState } from 'react'
import { dummyLeaveData } from '../assets/assets'
import { PlusIcon, ThermometerIcon, TreePalmIcon, UmbrellaIcon, Check, X } from 'lucide-react'

const statusStyles = {
  APPROVED: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  REJECTED: "bg-red-50 text-red-700",
}

const toTitleCase = (str) =>
  str ? str.charAt(0) + str.slice(1).toLowerCase() : str

const formatDateRange = (start, end) => {
  const opts = { day: 'numeric', month: 'short', year: 'numeric' }
  const startStr = new Date(start).toLocaleDateString('en-GB', opts)
  const endStr = new Date(end).toLocaleDateString('en-GB', opts)
  return startStr === endStr ? startStr : `${startStr} – ${endStr}`
}

const Leave = () => {

  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  const cardItems = [
    { title: "Sick Leave", icon: ThermometerIcon, number: leaves.filter(l => l.type === "SICK").length },
    { title: "Casual Leave", icon: UmbrellaIcon, number: leaves.filter(l => l.type === "CASUAL").length },
    { title: "Annual Leave", icon: TreePalmIcon, number: leaves.filter(l => l.type === "ANNUAL").length },
  ]

  const fetchEmployeeLeave = useCallback(async () => {
    setLoading(true)
    setLeaves(dummyLeaveData)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    fetchEmployeeLeave()
  }, [fetchEmployeeLeave])

  // Update one leave's status locally. Swap the body for a real
  // API call (e.g. PATCH /api/leaves/:id) once the backend exists.
  const handleApprove = (id) => {
   setLeaves(prev => prev.map(l => l.id === id ? {...l , status:"APROUVED"} : l))
  }

  const handleReject = (id) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "REJECTED" } : l))
  }

  return (
    <div className='mx-5 my-7'>
      {/** Page Header */}
      <div className='w-full flex justify-between mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Leave Management</h1>
          <p className='text-base font-normal text-[#62748E]'>Your leave history and requests</p>
        </div>
        <button
          type="button"
          className='flex items-center gap-2 px-4 py-2 rounded-md  text-white cursor-pointer bg-[#4F39F6]'
        >
          <PlusIcon size={16} />
          <span>Apply Leave</span>
        </button>
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

        <div className="grid grid-cols-5 gap-2 pb-2 mb-2 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
          <p>Type</p>
          <p>Dates</p>
          <p>Reason</p>
          <p>Status</p> 
          <p>Action</p>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-24'>
            <span className='h-8 w-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin'></span>
          </div>
        ) : (
          leaves.map((l) => (
            <div
              key={l.id}
              className='grid grid-cols-5 gap-4 items-center py-2 border-t border-gray-100 text-sm'
            >
              <p className='font-medium'>{toTitleCase(l.type)}</p>
              <p>{formatDateRange(l.startDate, l.endDate)}</p>
              <p className='truncate'>{l.reason}</p>

              <div className="flex items-center gap-2">
                <p className={`px-2 py-1 rounded text-xs font-medium w-fit ${statusStyles[l.status] || "bg-gray-100 text-gray-600"}`}>
                  {toTitleCase(l.status)}
                </p>

                {l.status === "PENDING" && (
                  <div className="flex items-center mx-40">
                    <button
                      type="button"
                      onClick={() => handleApprove(l.id)}
                      className="p-1 rounded-full hover:bg-green-50 text-green-600 cursor-pointer "
                      aria-label="Approve leave"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(l.id)}
                      className="p-1 rounded-full hover:bg-red-50 text-red-600 cursor-pointer"
                      aria-label="Reject leave"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Leave