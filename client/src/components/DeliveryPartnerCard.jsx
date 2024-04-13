/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './Loading';
import SuccessComponent from './SuccessComponent';
const DeliveryPartnerCard = ({ deliveryPartner }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
 
  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState(false);
  const [register,setRegister] =useState(false);
  
    const [status,setStatus] = useState(false);
    const [userData,setData] =useState({})

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
 
  useEffect(()=>{
    // console.log(deliveryPartner.firstname);
    if(deliveryPartner.approved || deliveryPartner.disapproved){
      setStatus(true);
      // console.log(status)
    }
    else{
      setStatus(false)
    }
  },[deliveryPartner.approved, deliveryPartner.disapproved])
  useEffect(()=>{
    if(status===true && deliveryPartner.approved){
        const partnerInfo= {
             name: deliveryPartner.firstname,
             phone :deliveryPartner.phone,
             email :deliveryPartner.email,
             password : generateRandomPassword(12),
             isAdmin : false,
             isRider : deliveryPartner.approved
        }

        setData(partnerInfo)
       }
      }
      
  ,[status])

  useEffect(()=>{
    if(userData.isRider === true){
      RegisterRider();
    } 
  },[userData.isRider])

  useEffect(() => {
    setRegister(false);
    setSuccess(false); // Reset the register state when deliveryPartner changes
  }, [deliveryPartner])

  async function RegisterRider(){
    if(deliveryPartner.registered === true){
      return ;
    }
    if(userData.isRider===true ){
       try{
           const result = (await axios.post("/api/users/register",userData)).data;
           console.log(result);
           if(result.isRider ===  true){
             setRegister(true);
             updateApprovalStatus("registered",deliveryPartner._id)
             console.log("rider registered successfully")
           }
       }
       catch(error){
         console.log(error.message);
       }
     
    }
   }

  const  updateApprovalStatus= async (updatedField , _id)=>{
    try {
      setLoading(true);
      const response = await axios.patch(`/api/partners/${_id}`, { updatedField: updatedField } );
      if(response){
        setSuccess(true);
      }
      setLoading(false);
      return response.data; 
    } catch (error) {
      setLoading(false);
      console.error('Error updating approval status:', error.message);
      throw error; 
    }
  }

  const handleApproval = async (updatedField,_id) => {
    
    console.log(updatedField,_id)
    try {
        setLoading(true)
        const updatedDocument = await updateApprovalStatus(updatedField , _id);
        setLoading(false);
        // console.log(userData)
      console.log('Field updated successfully:', updatedDocument);
    } catch (error) {
      setLoading(false);
      console.error('Error updating approval status:', error.message);
    }
  };

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-md p-2 mb-2 w-7/12 relative">
    { loading && <Loading/>}
    {success && <SuccessComponent message="Status updated refresh the page"/>}
     <div className='flex flex-col'>
      <p className={`font-semibold mb-4 absolute top-0 right-0 ${
        deliveryPartner.approved === true ? 'text-green-500' : deliveryPartner.disapproved === true ? 'text-red-500' : 'text-blue-500'
      }`}>
        {deliveryPartner.approved === true ? 'approved' : deliveryPartner.disapproved === true ? 'disapproved' : ''}
      </p>
      {register && <p className='font-semibold mt-4 text-blue-500 absolute right-0 '>
         registered
       </p>
      }
     </div>
      <h2 className="text-lg font-semibold mb-2">{deliveryPartner.firstname} {deliveryPartner.lastname}</h2>
      <p className="text-sm text-gray-600 mb-2">{deliveryPartner.email}</p>
      <p className="text-sm text-gray-600 mb-2">{deliveryPartner.phone}</p>
      <p className="text-sm text-gray-600 mb-2">{deliveryPartner.address}</p>
      <p className="text-sm text-gray-600 mb-2">Vehicle Type: {deliveryPartner.vehicleType}</p>
      <p className="text-sm text-gray-600 mb-2">Vehicle Number: {deliveryPartner.vehicleNumber}</p>
      <div className="flex flex-wrap -mx-1 mb-2">
        {Object.entries(deliveryPartner).slice(10,16 ).map(([fieldName, image], index) => (
          <div key={index} className="w-1/2 p-1">
            <img
              src={image}
              alt={fieldName}
              className="w-full h-auto cursor-pointer shadow-md"
              onClick={() => openImageModal(image)}
            />
            {fieldName === "bikePhoto" ? "vehiclePhoto" : fieldName}
            {/* <p className="text-sm text-gray-600 mt-1">{fieldName}</p> */}
          </div>
        ))}
      </div>
      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
          <div className="max-w-md max-h-md overflow-y-auto">
            <img
              src={selectedImage}
              alt="Enlarged Image"
              className="max-w-full max-h-full"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-0 right-0 m-4 text-white focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
    {
      (!status) && (
      <div className="flex mt-">
        <button 
          onClick={() => handleApproval("approved", deliveryPartner._id)}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md mr-2 mx-auto"

        >
          Approve
        </button>
        <button 
          onClick={() => handleApproval("disapproved", deliveryPartner._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md mx-auto"
        >
          Disapprove
        </button>
      </div>
    )
    }

    </div>
  );
};

export default DeliveryPartnerCard;
