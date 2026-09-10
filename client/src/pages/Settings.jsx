import React, { useEffect, useState } from 'react'
import { dummyProfileData } from '../assets/assets';
import Loading from '../components/Loading'
import { Save, Lock } from 'lucide-react' 
import ChangePassword from '../components/ChangePassword';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({});
  const [showPasswordPage, setShowPasswordPage] = useState(false);

  const handleChanges = (e) => {
    e.preventDefault();
    console.log('Saving changes:', {
      position: employeeData.position,
      bio: employeeData.bio,
    });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProfileData = async () => {
    setLoading(true);
    setEmployeeData(dummyProfileData);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className='mx-5 my-7'>
      {/* Page Header */}
      <div className='w-full flex justify-between mb-6'>
        <div className='grid gap-2'>
          <h1 className='text-2xl font-medium'>Settings</h1>
          <p className='text-base font-normal text-[#62748E]'>Manage your account and preferences</p>
        </div>
      </div>

      {loading ? <Loading /> : (
        <>
          <form onSubmit={handleChanges} className='p-6 flex flex-col gap-5 items-start border border-gray-400'>
            <div className='flex w-full gap-6'>
              <div className='flex flex-1 min-w-0 gap-2 flex-col'>
                <label htmlFor="fullName" className='text-sm font-medium'>First Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={`${employeeData.firstName ?? ''} ${employeeData.lastName ?? ''}`}
                  disabled
                  className='p-2 bg-[#E2E8F0] text-gray-500 rounded-md w-full'
                />
              </div>
              <div className='flex flex-1 min-w-0 gap-2 flex-col'>
                <label htmlFor="email" className='text-sm font-medium'>Email</label>
                <input
                  id="email"
                  type="text"
                  value={employeeData.email ?? ''}
                  disabled
                  className='p-2 bg-[#E2E8F0] text-gray-500 rounded-md w-full'
                />
              </div>
            </div>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="position" className='text-sm font-medium'>Position</label>
              <textarea
                id="position"
                name="position"
                value={employeeData.position ?? ''}
                onChange={handleFieldChange}
                className='p-2 border border-gray-300 rounded w-full text-gray-700'
              />
            </div>

            <div className='flex flex-col w-full gap-2'>
              <label htmlFor="bio" className='text-sm font-medium'>Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder='Write a brief bio...'
                value={employeeData.bio ?? ''}
                onChange={handleFieldChange}
                className='p-2 border border-gray-300 rounded w-full text-gray-700'
              />
            </div>

            <p className='text-gray-500'>This will be displayed on your profile.</p>

            <button
              type="submit"
              className='bg-[#4F39F6] px-4 py-2 text-white self-end flex items-center gap-2 cursor-pointer rounded-md'
            >
              <Save size={16} />
              <p>Save Changes</p>
            </button>

            <div className='mt-4 border border-gray-400 p-3 rounded flex justify-between  w-full'>
              <div className='flex gap-3'>
                <div className='p-3 bg-[#F1F5F9]' >
                  <Lock />
                </div>
                <div className='flex flex-col'>
                  <h1>Password</h1>
                  <p>Update your account password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordPage(true)}
                className='p-2 border border-gray-500 cursor-pointer'
              >
                Change
              </button>
            </div>
          </form>

         
          <ChangePassword
            isOpen={showPasswordPage}
            onClose={() => setShowPasswordPage(false)}
            onSubmit={({ currentPassword, newPassword }) => {
              setShowPasswordPage(false)
            }}
          />
        </>
      )}
    </div>
  )
}
export default Settings