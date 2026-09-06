import React, { useEffect, useState } from 'react'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'
import EmployeeDahboard from '../components/EmployeeDahboard'
import AdminDashboard from '../components/AdminDashboard'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true) 


    useEffect(() => {
        setData(dummyEmployeeDashboardData)
        setLoading(false) 
        console.log(data)
    }, [])

    if (loading || !data) {
        return (
            <div className='h-screen w-full flex justify-center items-center'>
                <span className='h-10 w-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin'></span>
            </div>
        )
    }

    return (
        <div className='grid gap-4 mx-4 mt-4'>
            <div className='flex flex-col gap-1 justify-start'>
                <h1 className='text-lg font-medium text-[#0F172B]'>Welcome, Joseph!</h1>
                <p className='text-[#62748E] font-normal text-sm'>DevOps - Developement </p> 
            </div>

            {data.role === "ADM"
                ? <AdminDashboard data={data} />
                : <EmployeeDahboard data={data} />
            }
        </div>
    )
}

export default Dashboard