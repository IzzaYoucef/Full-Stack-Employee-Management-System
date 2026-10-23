import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import EmployeeDahboard from '../components/EmployeeDahboard'
import AdminDashboard from '../components/AdminDashboard'
import Loading from '../components/Loading'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true) 


    useEffect(() => {
        const load = async () => {
            try {
                if (localStorage.getItem("role") === "ADMIN") {
                    const res = await api.get("/dashboard")
                    setData(res.data.data)
                } else {
                    const [p, l, s, a] = await Promise.all([
                        api.get("/profile"), api.get("/leave"), api.get("/payslips"), api.get("/attendances"),
                    ])
                    const month = new Date().getMonth()
                    setData({
                        role: "EMPLOYEE",
                        employee: p.data.data,
                        pendingLeaves: l.data.data.filter((x) => x.status === "PENDING").length,
                        latestPayslip: s.data.data[0],
                        currentMonthAttendance: a.data.data.filter((x) => new Date(x.date).getMonth() === month).length,
                    })
                }
            } catch (err) {
                toast.error(err.response?.data?.message || 'Something went wrong')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading || !data) {
        return (
            <Loading />
        )
    }

    return (
        <div className='grid gap-4 mx-4 mt-4'>
            <div className='flex flex-col gap-1 justify-start'>
                <h1 className='text-lg font-medium text-[#0F172B]'>Welcome, {data.employee?.firstName ?? "Admin"}!</h1>
                <p className='text-[#62748E] font-normal text-sm'>{data.employee ? `${data.employee.position} - ${data.employee.department}` : "Administrator"}</p> 
            </div>

            {data.role === "ADMIN"
                ? <AdminDashboard data={data} />
                : <EmployeeDahboard data={data} />
            }
        </div>
    )
}

export default Dashboard