import React, { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { DownloadIcon, PlusIcon } from 'lucide-react' 
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'

const PaySlips = () => {
  const isAdmin = localStorage.getItem('role') === 'ADMIN'
  const [loading, setLoading] = useState(true)
  const [paySlips, setPaySlips] = useState([]) ; 
  const navigate = useNavigate() ; 

  const now = new Date()
  const emptyForm = { employeeId: '', month: now.getMonth() + 1, year: now.getFullYear(), basicSalary: '', allowances: '', deductions: '' }
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [employees, setEmployees] = useState([])
  const [saving, setSaving] = useState(false)

  const fetchPaySlips = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/payslips')
      setPaySlips(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }, [])

  useEffect(() => { 
    fetchPaySlips()
  }, [])

  const openForm = async () => {
    setShowForm(true)
    try {
      const { data } = await api.get('/employees')
      setEmployees(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // choosing an employee pre-fills his salary figures (still editable)
  const handleEmployee = (e) => {
    const emp = employees.find((x) => x.id === e.target.value)
    setForm({
      ...form,
      employeeId: e.target.value,
      basicSalary: emp?.basicSalary ?? '',
      allowances: emp?.allowances ?? '',
      deductions: emp?.deductions ?? '',
    })
  }

  const net = Number(form.basicSalary || 0) + Number(form.allowances || 0) - Number(form.deductions || 0)

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/payslips', form)
      toast.success('Payslip created')
      setShowForm(false)
      setForm(emptyForm)
      fetchPaySlips()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
    setSaving(false)
  }

  const elementsToDisplay = ['period', 'basic salary', 'net salary', 'action']

  return (
    <div className='mx-5 my-7'>
      {/* Header */}
      <div className='w-full flex justify-between mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Payslips</h1>
          <p className='text-base font-normal text-[#62748E]'>{isAdmin ? 'All employees payslips' : 'Your payslip history'}</p>
        </div>
        {isAdmin && (
          <button
            type='button'
            onClick={openForm}
            className='flex items-center gap-2 px-2 h-10 rounded-md bg-[#4F39F6] text-white cursor-pointer'
          >
            <PlusIcon size={16} />
            <p className='text-sm font-normal'>Create Payslip</p>
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className='border border-gray-200 rounded p-2'>
          {/* Header row */}
          <div className='grid grid-cols-4 items-center'>
            {elementsToDisplay.map((element, index) => (
              <p key={index} className='capitalize text-gray-500 font-bold'>
                {element}
              </p>
            ))}
          </div>

          {/* Data rows */}
          {paySlips.map((p, index) => (
            <div
              key={index}
              className='grid grid-cols-4 items-center py-2 border-t border-gray-100'
            >
              <p className='capitalize text-gray-700 font-semibold'>
                {isAdmin && p.employee ? `${p.employee.firstName} ${p.employee.lastName} - ` : ''}{p.month}/{p.year}
              </p>
              <p className='capitalize text-gray-700 font-semibold'>${p.basicSalary}</p>
              <p className='capitalize text-gray-700 font-semibold'>${p.netSalary}</p>
              <button
                type='button'
                className='flex items-center gap-2 p-2 bg-gray-100 text-blue-600 justify-center rounded cursor-pointer' 
                onClick={() => navigate("/print/payslip/" + p._id)}
              >
                <DownloadIcon size={16} />
                <span>Download</span>
              </button>
            </div> 
          ))}
        </div>
      )}

      {/* Create Payslip form (admin only) */}
      {isAdmin && showForm && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'>
          <form onSubmit={handleCreate} className='bg-white rounded-lg p-6 w-full max-w-md grid gap-3'>
            <h2 className='text-lg font-medium'>Create Payslip</h2>
            <select name='employeeId' value={form.employeeId} onChange={handleEmployee} required className='border border-gray-300 rounded-md px-3 py-2'>
              <option value=''>Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
            <div className='grid grid-cols-2 gap-3'>
              <input name='month' type='number' min='1' max='12' value={form.month} onChange={handleChange} placeholder='Month (1-12)' required className='border border-gray-300 rounded-md px-3 py-2' />
              <input name='year' type='number' min='2000' value={form.year} onChange={handleChange} placeholder='Year' required className='border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <input name='basicSalary' type='number' min='0' value={form.basicSalary} onChange={handleChange} placeholder='Basic salary' required className='border border-gray-300 rounded-md px-3 py-2' />
            <div className='grid grid-cols-2 gap-3'>
              <input name='allowances' type='number' min='0' value={form.allowances} onChange={handleChange} placeholder='Allowances' className='border border-gray-300 rounded-md px-3 py-2' />
              <input name='deductions' type='number' min='0' value={form.deductions} onChange={handleChange} placeholder='Deductions' className='border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <p className='text-sm text-gray-500'>Net salary: <span className='font-semibold text-gray-800'>${net}</span></p>
            <div className='flex justify-end gap-2 mt-2'>
              <button type='button' onClick={() => setShowForm(false)} className='px-4 py-2 rounded-md border border-gray-300 cursor-pointer'>Cancel</button>
              <button type='submit' disabled={saving} className='px-4 py-2 rounded-md bg-[#4F39F6] text-white cursor-pointer disabled:opacity-60'>{saving ? 'Saving...' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default PaySlips
