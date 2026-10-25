import {
  ArrowRight,
  CalendarCheck,
  CalendarX,
  DollarSign,
  LayoutDashboardIcon,
  LogOutIcon,
  Menu,
  Settings,
  UserIcon,
  UsersIcon,
  XIcon
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboardIcon, to: "/dashboard" },
  { label: "Employees", icon: UsersIcon, to: "/employees" },
  // { label: "Attendance", icon: CalendarCheck, to: "/attendance" },
  { label: "Leave", icon: CalendarX, to: "/leave" },
  { label: "PaySlips", icon: DollarSign, to: "/payslips" },
  { label: "Settings", icon: Settings, to: "/settings" },
]

const employeeNavItems = [
  { label: "Dashboard", icon: LayoutDashboardIcon, to: "/dashboard" },
  { label: "Attendance", icon: CalendarCheck, to: "/attendance" },
  { label: "Leave", icon: CalendarX, to: "/leave" },
  { label: "PaySlips", icon: DollarSign, to: "/payslips" },
  { label: "Settings", icon: Settings, to: "/settings" },
]

const SideBar = () => {
  const [mobileShow, setMobileShow] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const role = localStorage.getItem("role") === "EMPLOYEE" ? "Employee" : "Admin"

  useEffect(() => {
    api.get("/profile")
      .then(({ data }) => {
        setName(data.data.firstName + " " + data.data.lastName)
        setUserName(data.data.firstName)
      })
      .catch(() => { // the admin account has no employee profile
        setName("Admin")
        setUserName("Admin")
      })
  }, [])

  useEffect(() => {
    setMobileShow(false)
  }, [location])

  const navItems = role === "Admin" ? adminNavItems : employeeNavItems

  const SideBarContent = ({ isMobile }) => (
    <>
      <div className="relative border-b border-transparent pb-3">
        <div className="flex gap-2 items-center">
          <UserIcon size={28} className="text-white" />
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-lg text-white">{name}</h1>
            <p className="text-sm text-[#62748E] font-semibold">Management System</p>
          </div>
          {isMobile && (
            <button
              type="button"
              className="absolute right-0 top-0"
              onClick={() => setMobileShow(false)}
              aria-label="Close menu"
            >
              <XIcon size={18} className="cursor-pointer text-white" />
            </button>
          )}
        </div>
      </div>

      {userName && (
        <div className='mt-4 mb-3 p-3 rounded-lg bg-white/3 border border-white/4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 flex items-center justify-center border rounded border-white outline-none bg-transparent'>
              <span className='text-[#90A1B9] font-medium'>{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-semibold text-md text-[#E2E8F0]">{userName}</h1>
              <p className="text-sm text-[#62748E] font-semibold">{role === "Admin" ? "Administrator" : "Employee"}</p>
            </div>
          </div>
        </div>
      )}

      <p className="uppercase text-[#62748E] text-xs mt-4 mb-2">Navigation</p>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.to}
            type="button"
            onClick={() => navigate(item.to)}
            className="flex justify-between items-center w-full p-2 rounded-md text-white hover:bg-[#615FFF1F] focus:bg-[#615FFF1F] transition-colors mb-2"
          >
            <div className="flex items-center gap-2">
              <item.icon size={18} />
              <span className="font-semibold text-sm">{item.label}</span>
            </div>
            <ArrowRight size={15} />
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => { localStorage.clear(); navigate("/login") }}
        className="mt-8 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold text-white"
      >
        <LogOutIcon size={18} />
        Log out
      </button>
    </>
  )

  return (
    <>
      <div className="md:hidden flex items-center gap-3 p-3 border-b border-slate-200 bg-white">
        <button
          type="button"
          className="p-1 cursor-pointer"
          onClick={() => setMobileShow(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="font-semibold text-slate-800">Management System</span>
      </div>

      {mobileShow && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileShow(false)} />
          <aside className="relative h-dvh w-64 max-w-[85%] overflow-y-auto bg-indigo-950 p-4">
            <SideBarContent isMobile />
          </aside>
        </div>
      )}

      <aside className="hidden md:flex md:flex-col h-dvh w-64 shrink-0 bg-indigo-950 p-4">
        <SideBarContent isMobile={false} />
      </aside>
    </>
  )
}

export default SideBar