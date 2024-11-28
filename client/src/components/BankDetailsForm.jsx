/* eslint-disable react/prop-types */
import  { useState } from 'react';
import axios from 'axios';
import SuccessComponent from './SuccessComponent';
const BankDetailsForm = ({role}) => {

  const RiderName = JSON.parse(localStorage.getItem("user")).name;
  const RiderPhone = JSON.parse(localStorage.getItem("user")).phone
  const url= import.meta.env.BASE_URL

  const [success,setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    bankBranch: '',
    ifscCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitAdd = async() => {
    
    const bankdetails = {...formData, RiderPhone, RiderName}
    try{
       const response = (await axios.post(url+"/api/bank/bankdetails",bankdetails)).data;
       setSuccess(true);
       console.log(response);
    }
    catch(error)
    {
      console.log(error.message);
    }
    console.log('Form submitted:', formData);
  };
  
  const handleSubmitEdit = async () => {
    try {
      const response = await axios.patch(url+"/api/bank/edit", { ...formData, RiderPhone });
      setSuccess(true);
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10">
      {success && <SuccessComponent message= "Details saved Successfully"/>}
      {role==="add" && <h2 className="text-2xl font-bold mb-4">Add Bank Details</h2>}
      {role==="edit" && <h2 className="text-2xl font-bold mb-4">Edit Bank Details Form</h2>}
      <form  className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="accountHolderName" className="block text-gray-700 font-bold mb-2">Account Holder Name:</label>
          <input
            type="text"
            id="accountHolderName"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="accountNumber" className="block text-gray-700 font-bold mb-2">Account Number:</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            // pattern="^[0-9]{10,18}$"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bankName" className="block text-gray-700 font-bold mb-2">Bank Name:</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bankBranch" className="block text-gray-700 font-bold mb-2">Bank Branch:</label>
          <input
            type="text"
            id="bankBranch"
            name="bankBranch"
            value={formData.bankBranch}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ifscCode" className="block text-gray-700 font-bold mb-2">IFSC Code:</label>
          <input
            type="text"
            id="ifscCode"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
            // pattern="^[A-Z]{4}0[0-9]{6}$"
          />
        </div>
        {
          role==="add" && <div className="mb-4">
          <button onClick={handleSubmitAdd} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Submit</button>
        </div>
        }
        { role==="edit" && 
        <div className="mb-4">
          <button onClick={handleSubmitEdit} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Submit</button>
        </div>
        }
      </form>
    </div>
  );
};

export default BankDetailsForm;
