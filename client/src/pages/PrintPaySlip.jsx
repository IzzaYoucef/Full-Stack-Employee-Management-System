import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dummyPayslipData } from '../assets/assets';
import Loading from '../components/Loading';
import { Printer } from 'lucide-react';

const PrintPaySlip = () => {
  const [loading, setLoading] = useState(true);
  const [payslip, setPayslip] = useState({});
  const [tableContent, setTableContent] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    const foundSlip = dummyPayslipData.find((slip) => slip._id === id);
    setPayslip(foundSlip ?? {});

    setTableContent([
      { key: 'Basic Salary', value: `$${foundSlip?.basicSalary ?? 0}` },
      { key: 'Allowances', value: `+$${foundSlip?.allowances ?? 0}` },
      { key: 'Deductions', value: `-$${foundSlip?.deductions ?? 0}` },
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return <Loading />
  }

  return (
    <div className='w-full max-w-2xl mx-auto my-10 p-6 border border-gray-200 rounded text-center'>
      <h1 className='capitalize text-lg font-bold'>Payslip</h1>
      <p className='uppercase text-gray-700 text-base font-semibold'>
        {payslip?.month}/{payslip?.year}
      </p>

      <div className='flex justify-between items-center mt-5 mb-5'>
        <div>
          <p className='uppercase text-gray-700 text-base font-semibold'>Employee Name</p>
          <h1 className='text-lg font-bold'>
            {payslip?.employee?.firstName} {payslip?.employee?.lastName}
          </h1>
        </div>
        <div>
          <p className='uppercase text-gray-700 text-base font-semibold'>Position</p>
          <h1 className='capitalize text-lg font-bold'>{payslip?.employee?.position}</h1>
        </div>
      </div>

      <div className='flex justify-between items-center mt-4'>
        <div>
          <p className='uppercase text-gray-700 text-base font-semibold'>Email</p>
          <h1 className='text-lg font-bold'>{payslip?.employee?.email}</h1>
        </div>
        <div>
          <p className='uppercase text-gray-700 text-base font-semibold'>Period</p>
          <h1 className='capitalize text-lg font-bold'>
            {payslip?.month}/{payslip?.year}
          </h1>
        </div>
      </div>

      <table className='w-full mt-6 border-collapse'>
        <thead>
          <tr className='bg-[#E2E8F0]'>
            <th className='capitalize text-gray-700 text-left p-2'>Description</th>
            <th className='capitalize text-gray-700 text-right p-2'>Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableContent.map((element, index) => (
            <tr key={index} className='mt-5' >
              <td className='uppercase text-gray-700 p-2 text-left'>{element.key}</td>
              <td className='text-base font-semibold p-2 text-right'>{element.value}</td>
            </tr>
          ))}
          <tr className='bg-[#E2E8F0]'>
            <td className='font-bold p-2 text-left '>Net Salary</td>
            <td className='font-bold p-2 text-right'>${payslip?.netSalary}</td>
          </tr>
        </tbody>
      </table>

      <div className='flex justify-between items-center mt-6'>
        <button
          type='button'
          onClick={() => window.print()}
          className='bg-blue-600 p-2 text-white flex items-center gap-2 rounded cursor-pointer'
        >
          <Printer size={16} />
          Print Payslip
        </button>
      </div>
    </div>
  )
}

export default PrintPaySlip