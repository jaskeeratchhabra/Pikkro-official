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
  
    const [status,setStatus] = useState("");
    const [userData,setData] =useState({})
      const url= import.meta.env.BASE_URL

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
    // if(status==="approved" || deliveryPartner.approved){
        const partnerInfo= {
             name: deliveryPartner.firstname,
             phone :deliveryPartner.phone,
             email :deliveryPartner.email,
             password : generateRandomPassword(12),
             isAdmin : false,
             isRider : true
        }

        setData(partnerInfo)
      //  }
      }
      
  ,[])

  useEffect(() => {
    setRegister(false);
    setSuccess(false);
  }, [deliveryPartner])

  async function RegisterRider(_id){
    if(deliveryPartner.registered === true){
      return;
    }
    try{
     if(userData.isRider===true){
         setLoading(true);
         const result = (await axios.post(url+"/api/users/register",userData)).data;
         // console.log(result);
         if(result.isRider ===  true){
           const response = await axios.patch(url+`/api/partners/${_id}`, { updatedField:"registered" } );
           console.log(response);
           if(response.status===200){
              setRegister(true);
              console.log("hello")
              sendMail("approved");
           }
         }
         setLoading(false);
     }
    }
       catch(error){
         console.log(error.message);
         setLoading(false);
       }
     
    }
   
  const sendMail= async (reqStatus)=>{
    let user;
    if(reqStatus==="approved"){
      user = {
      to: deliveryPartner.email,
      subject : "Your request for delivery partner is approved",
      description : `Congratulations ${userData.name}, you have been selected as delivery partner let's begin the new journey and earn together, you can login to your account by using Phone :${userData.phone} and Password: ${userData.password}, you can change your password by clicking forgot password on a login page or you can use this password as well `,
     }
    }
    else
    {
      user={
         to: deliveryPartner.email,
         subject : "your request for delivery partner is disapproved",
         description : "you can further contact to our team at support@pikkro.in or can fill another form with correct details, we will reach you soon",
      }
    }
    await axios.post(url+"/api/users/email",user)
   .then(response => {console.log(response.data.respMesg)
    console.log(response.status)
  }
   );
  }

  const  updateApprovalStatus= async (updatedField , _id)=>{
    try {
      setLoading(true);
      await axios.patch(url+`/api/partners/${_id}`, { updatedField: updatedField } );
      if(updatedField ==="approved"){
        setSuccess(true);
        setStatus(updatedField)
        RegisterRider(deliveryPartner._id);
      }
      else
      if(updatedField ==="disapproved"){
        setSuccess(true);
        setStatus(updatedField)
        sendMail("disapproved")
      }
      setLoading(false);
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
        console.log('Field updated successfully:', updatedDocument);
    } catch (error) {
        setLoading(false);
        console.error('Error updating approval status:', error.message);
    }
  };

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-md p-4 mb-2 md:w-7/12 w-fit  relative">
    { loading && <Loading/>}
    {success && <SuccessComponent message="Status updated refresh the page"/>}
     <div className='flex flex-col'>
      <p className={`font-semibold mb-4 absolute top-0 right-0 ${
        deliveryPartner.approved === true ? 'text-green-500' : deliveryPartner.disapproved === true ? 'text-red-500' : 'text-blue-500'
      }`}>
        {deliveryPartner.approved === true ? 'Approved' : deliveryPartner.disapproved === true ? 'Disapproved' : ''}
      </p>
      {(deliveryPartner.registered || register) && <p className='font-semibold mt-4 text-blue-500 absolute right-0 '>
         Registered
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
        {Object.entries(deliveryPartner).slice(8,14).map(([fieldName, image], index) => (
          <div key={index} className="w-1/2 p-3 ">
            <img
              src={image}
              alt={fieldName}
                   
              className="w-30 h-20 cursor-pointer shadow-md"
              onClick={() => openImageModal(image)}
            />
            {fieldName === "bikePhoto" ? "vehiclePhoto" : fieldName}
          </div>
        ))}
      </div>
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
      <div className="flex mt-">
       {  (deliveryPartner.disapproved || !deliveryPartner.registered) && <button 
          onClick={() => handleApproval("approved", deliveryPartner._id)}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md mr-2 mx-auto"

        >
          Approve
        </button>
       }
       { (deliveryPartner.approved || !deliveryPartner.registered) && 
        <button 
          onClick={() => handleApproval("disapproved", deliveryPartner._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md mx-auto"
        >
          Disapprove
        </button>


       }
      </div>
    }

    </div>
  );
};

export default DeliveryPartnerCard;
