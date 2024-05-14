import { useState } from 'react';
import axios from "axios"
import SuccessComponent from "../components/SuccessComponent";
import Loading from "../components/Loading";
import { Link } from 'react-router-dom';

const DeliveryPartnerForm = () => {

  const [loading,setLoading]=useState(false);
  const [success,setSuccess] =useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    vehicleType: '',
    vehicleNumber: '',
    dlDocument: null,
    poaDocument: null,
    poiDocument: null,
    rcDocument: null,
    bikePhoto: null,
    profilePicture: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      
      // Append all form data values
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      
      const result = await axios.post("/api/partners/newpartner", formDataToSend);
      
      setLoading(false);
      
      if (result) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
    
    console.log(formData);
  };
  
  // const handleImageChange = (e) => {
  //   const { name, files } = e.target;
  //   if (files && files[0]) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(files[0]);
  //     reader.onload = () => {
  //       const imageUrl = reader.result;
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         [name]: imageUrl
  //       }));
  //     };
  //   }
  // };

  return (
    <>
    {success && <SuccessComponent message="Your data has been sent for approval"/>}
    <h1 className='text-bold text-center mt-4'>If you are already a delivery partner <Link className='text-blue-500' to="/Login">Login here</Link></h1>
    <div className="max-w-lg mx-auto mt-8 p-6 bg-gray-100 rounded-md">
    {loading && <Loading/>}
     {/* {formData.dlDocument && <img src={formData.dlDocument} alt="Driving Licence Document" />} */}

      <h2 className="text-xl font-semibold mb-4">Delivery Partner Details</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-2">First Name:</label>
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Last Name:</label>
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Vehicle Type:</label>
          <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Vehicle Number:</label>
          <input type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Profile Picture:</label>
          <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded-md"required />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Driving Licence Document:</label>
          <input type="file" name="dlDocument" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">POA Document(Proof of Address ex-Aadhar):</label>
          <input type="file" name="poaDocument" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">POI Document(Proof of Identity ex- DL, Aadhar, Passport):</label>
          <input type="file" name="poiDocument" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">RC Document:</label>
          <input type="file" name="rcDocument" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded-md" required/>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Vehicle Photo:</label>
          <input type="file" name="bikePhoto" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded-md" required/>
        </div>
        {success===true ? <button className="bg-green-500 text-white py-2 px-4 rounded-md">Submited</button>: <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Submit</button>}
      </form>
    </div>
    </>
  );
};

export default DeliveryPartnerForm;
