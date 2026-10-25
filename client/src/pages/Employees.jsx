import React, { useCallback, useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { PlusIcon, SearchIcon } from 'lucide-react'
import Loading from '../components/Loading'

const Employees = () => {

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true) 
  const [filtredEmployees , setFiltredEmployees] = useState([]) ; 

  const fetchEmployeesData = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/employees')
      setEmployees(data.data)
      setFiltredEmployees(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }, []) 

  const DEPARTMENTS = ["Engineering", "Human Resources", "Marketing", "Sales", "Finance", "Operations", "IT Support", "Customer Success", "Product Management", "Design"]
  const emptyForm = { firstName: '', lastName: '', email: '', password: '', phone: '', position: '', department: 'Engineering', basicSalary: '', allowances: '', deductions: '', joinDate: '' }
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/employees', form)
      toast.success('Employee created')
      setShowForm(false)
      setForm(emptyForm)
      fetchEmployeesData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
    setSaving(false)
  }

  const handleInputSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setFiltredEmployees(
      employees.filter((employee) =>
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query)
      )
    )
  }

  useEffect(()=> {
    console.log(filtredEmployees);
  } , [])

  useEffect(() => {
    fetchEmployeesData()
  }, [fetchEmployeesData])

  return (
    <div className='mx-5 my-7'>
      {/** Header */}
      <div className='w-full flex flex-wrap items-start justify-between gap-3 mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Employees</h1>
          <p className='text-base font-normal text-[#62748E]'>Manage your team members</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className='flex items-center gap-2 px-2 h-10 rounded-md bg-[#4F39F6] text-white cursor-pointer'
        >
          <PlusIcon color='white' size={16} />
          <p className='text-sm font-normal'>Add Employee</p>
        </button>
      </div>

      {/** Search Bar */}
      <div className="relative w-full mb-5">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees"
          className='w-full border border-gray-300 rounded-md pl-9 pr-3 py-2.5' 
          onChange={handleInputSearch}
        />
      </div>

      {/** Employees */}
      {loading ? (
        <Loading />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {filtredEmployees.map((em) => (
            <div
              key={em.id ?? `${em.firstName}-${em.lastName}`}
              className='p-4 rounded-lg border border-gray-200 bg-white'
            >
              <header className='text-sm text-gray-500 mb-3'>
                {em.position}
              </header>
              <div className='h-16 w-16 rounded-full flex items-center justify-center bg-[#F1F5F9] mx-auto mb-3'>
                <span className='uppercase text-[#432DD7] font-semibold'>
                  {em.firstName?.charAt(0)}{em.lastName?.charAt(0)}
                </span>
              </div>
              <div className='flex flex-col items-center text-center gap-1'>
                <h1 className='text-base font-medium'>{em.firstName} {em.lastName}</h1>
                <p className='text-sm text-gray-500'>{em.department}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/** Add Employee form */}
      {showForm && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'>
          <form onSubmit={handleAddEmployee} className='bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto grid gap-3'>
            <h2 className='text-lg font-medium'>Add Employee</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <input name='firstName' value={form.firstName} onChange={handleChange} placeholder='First name' required className='border border-gray-300 rounded-md px-3 py-2' />
              <input name='lastName' value={form.lastName} onChange={handleChange} placeholder='Last name' required className='border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <input name='email' type='email' value={form.email} onChange={handleChange} placeholder='Email' required className='border border-gray-300 rounded-md px-3 py-2' />
            <input name='password' type='password' value={form.password} onChange={handleChange} placeholder='Password (min 6 characters)' minLength={6} required className='border border-gray-300 rounded-md px-3 py-2' />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <input name='phone' value={form.phone} onChange={handleChange} placeholder='Phone' required className='border border-gray-300 rounded-md px-3 py-2' />
              <input name='position' value={form.position} onChange={handleChange} placeholder='Position' required className='border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <select name='department' value={form.department} onChange={handleChange} className='border border-gray-300 rounded-md px-3 py-2'>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input name='joinDate' type='date' value={form.joinDate} onChange={handleChange} className='border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <input name='basicSalary' type='number' min='0' value={form.basicSalary} onChange={handleChange} placeholder='Basic salary' className='border border-gray-300 rounded-md px-3 py-2' />
              <input name='allowances' type='number' min='0' value={form.allowances} onChange={handleChange} placeholder='Allowances' className='border border-gray-300 rounded-md px-3 py-2' />
              <input name='deductions' type='number' min='0' value={form.deductions} onChange={handleChange} placeholder='Deductions' className='border border-gray-300 rounded-md px-3 py-2' />
            </div>
            <div className='flex justify-end gap-2 mt-2'>
              <button type='button' onClick={() => setShowForm(false)} className='px-4 py-2 rounded-md border border-gray-300'>Cancel</button>
              <button type='submit' disabled={saving} className='px-4 py-2 rounded-md bg-[#4F39F6] text-white disabled:opacity-60'>{saving ? 'Saving...' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Employees