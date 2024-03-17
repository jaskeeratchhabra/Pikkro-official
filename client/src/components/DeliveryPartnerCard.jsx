/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import axios from 'axios';
const DeliveryPartnerCard = ({ deliveryPartner }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const [status,setStatus] = useState(false);


  useEffect(()=>{
    
    if(deliveryPartner.approved || deliveryPartner.disapproved){
      setStatus(true);
    }
  },[])
  const  updateApprovalStatus= async (updatedField , _id)=>{
    try {
      const response = await axios.patch(`/api/partners/${_id}`, { updatedField: updatedField } );
      return response.data; 
    } catch (error) {
      console.error('Error updating approval status:', error.message);
      throw error; 
    }
  }

  const handleApproval = async (updatedField,_id) => {
    
    console.log(updatedField,_id)
    try {
      const updatedDocument = await updateApprovalStatus(updatedField , _id);
      console.log('Field updated successfully:', updatedDocument);
    } catch (error) {
      console.error('Error updating approval status:', error.message);
    }
  };

  return (
    <div className="bg-white border border-gray-300 shadow-md rounded-md p-2 mb-2 w-7/12 relative">
      <p className={`font-semibold mb-4 absolute top-0 right-0 ${
        deliveryPartner.approved === true ? 'text-green-500' : deliveryPartner.disapproved === true ? 'text-red-500' : 'text-blue-500'
      }`}>
        {deliveryPartner.approved === true ? 'approved' : deliveryPartner.disapproved === true ? 'disapproved' : ''}
      </p>

      <h2 className="text-lg font-semibold mb-2">{deliveryPartner.firstname} {deliveryPartner.lastname}</h2>
      <p className="text-sm text-gray-600 mb-2">{deliveryPartner.email}</p>
      <p className="text-sm text-gray-600 mb-2">{deliveryPartner.phone}</p>
      <p className="text-sm text-gray-600 mb-2">{deliveryPartner.address}</p>
      <p className="text-sm text-gray-600 mb-2">Vehicle Type: {deliveryPartner.vehicleType}</p>
      <p className="text-sm text-gray-600 mb-2">Vehicle Number: {deliveryPartner.vehicleNumber}</p>
      <div className="flex flex-wrap -mx-1 mb-2">
        {Object.entries(deliveryPartner).slice(8, 14).map(([fieldName, image], index) => (
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
      <div className="flex justify-between mt-4">
        <button 
          onClick={() => handleApproval("approved", deliveryPartner._id)}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md mr-2"
        >
          Approved
        </button>
        <button 
          onClick={() => handleApproval("disapproved", deliveryPartner._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
        >
          Disapproved
        </button>
      </div>
    )
    }

    </div>
  );
};

export default DeliveryPartnerCard;
