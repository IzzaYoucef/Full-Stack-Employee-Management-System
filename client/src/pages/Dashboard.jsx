import React, { useEffect, useState } from 'react'
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from '../assets/assets'
import EmployeeDahboard from '../components/EmployeeDahboard'
import AdminDashboard from '../components/AdminDashboard'
import Loading from '../components/Loading'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true) 


    useEffect(() => {
        setData(dummyAdminDashboardData)
        setLoading(false) 
        console.log(data)
    }, [])

    if (loading || !data) {
        return (
            <Loading />
        )
    }

    return (
        <div className='grid gap-4 mx-4 mt-4'>
            <div className='flex flex-col gap-1 justify-start'>
                <h1 className='text-lg font-medium text-[#0F172B]'>Welcome, Joseph!</h1>
                <p className='text-[#62748E] font-normal text-sm'>DevOps - Developement </p> 
            </div>

            {data.role === "ADMIN"
                ? <AdminDashboard data={data} />
                : <EmployeeDahboard data={data} />
            }
        </div>
    )
}

export default Dashboard