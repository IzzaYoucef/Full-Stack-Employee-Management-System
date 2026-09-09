import React from 'react' 
import {Routes , Route , Navigate} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import LoginLanding from './pages/LoginLanding'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import PaySlips from './pages/paySlips'
import Settings from './pages/Settings'
import PrintPaySlip from './pages/PrintPaySlip'
import Layout from './pages/Layout'
import LoginForm from './components/LoginForm'
const App = () => {
  return (
    <> 
      <Toaster/> 
      <Routes>
        <Route path="/login" element={<LoginLanding/>} />
        <Route path="/login/admin" element={<LoginForm role="admin" title="Admin Portal" subtitle="Sign in to manage the organization" />} /> 
        <Route path="/login/employee" element={<LoginForm role="employee" title="Employee Portal" subtitle="Sign in to manage the organization" />} />

        <Route path="print/payslip/:id" element={<PrintPaySlip/>} />

        <Route element={<Layout/>}>
          <Route index element={<Dashboard/>} />          
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="employees" element={<Employees/>} />
          <Route path="attendance" element={<Attendance/>}/>
          <Route path="leave" element={<Leave/>}/>
          <Route path='payslips' element={<PaySlips/>} />
          <Route path="settings" element={<Settings/>}/>
          <Route path="*" element={<Navigate to="dashboard" replace />} /> {/* unmatched → dashboard, still wrapped */}
        </Route>
      </Routes>
    </>
  )
}

export default App