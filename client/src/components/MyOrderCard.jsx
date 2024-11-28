/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router"
import Loading from './Loading';
import axios from 'axios';
import SuccessComponent from './SuccessComponent';
import PopupComponent from './PopupComponent';
import Swal from 'sweetalert2';
import OrderTracking from './OrderTracking';
import EditOrderScreen from '../screens/EditOrderScreen';
function OrderCard({ order}) {

    const navigate  = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [loading,setLoading] = useState(false);
    const [orderStatus,setStatus]  = useState("");
    const [showOrderTracking, setShowOrderTracking] = useState(false);
    const [editStatus,setEditStatus] = useState(false)
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };
    const handleEdit=()=>{
        // console.log(typeof order.Date)
        const date = new Date(order.Date)
        console.log(date)
        setEditStatus((prev)=>(!prev));
    }


    const handleCancel = async (value) => {
        if (order.picked === true) {
          console.log("Order can't be canceled");
          setStatus("picked");
          return;
        }
      
        // Show the SweetAlert2 modal
        const result = await Swal.fire({
          title: "Cancellation",
          text: "Cancellation charge of Rs 30 will be applied",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel"
        });
      
        // If the user confirmed the cancellation
        if (result.isConfirmed) {
          const userInfo = JSON.parse(localStorage.getItem("user"));
          const _id = order._id;
          const statusValue = {
            value: value,
            RiderPhone: userInfo.phone,
            RiderName: userInfo.name,
            canceledBy: "user"
          };
      
          try {
            setLoading(true);
            const response = await axios.patch(`https://api.pikkro.com/api/orders/${_id}`, statusValue);
            const result = response.data;
      
            if (result.updatedDocument["canceled"] === true) {
              console.log(result.message, "Order has been canceled");
              setStatus("canceled");
            }
            setLoading(false);
          } catch (error) {
            console.log(error.message);
            setLoading(false); // Ensure loading is set to false even if there's an error
          }
        }
      };
    return (
        <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden mb-4  mt-4 relative">
             {loading && <Loading/>}
             {orderStatus==="picked"  &&  Swal.fire("order can't be cancelled as it is processed by rider")}
             {orderStatus==="canceled" && <PopupComponent message="Order has been canceled"/> }
             {editStatus && <EditOrderScreen order={order}/>}
             <div className="absolute top-1 right-1 text-gray-700" >
             {
                order.completed===false && order.canceled===false && 
                <button onClick={handleEdit}>Edit</button>}
                { order.completed===false && (
                 (orderStatus==="canceled" || order.canceled===true) ? <button className="text-red-700 py-2 px-4  ml-4 rounded focus:outline-none focus:shadow-outline">
                  Cancelled</button>:
                  <button className="py-2 px-4  ml-4 rounded focus:outline-none focus:shadow-outline"
                  onClick = {()=>(handleCancel("canceled"))}>
                  Cancel</button>
                  )
                }
             </div>
             <div className='flex absolute top-6 '>
               <div className="mx-2 py-4 text-lg text-blue-900">
                   {order.Item} 
               </div>
               <div className="py-4 text-lg text-blue-900">
                   : {order.Date} 
               </div>
               
             </div>
             {order.completed === false && order.accepted === true && order.canceled === false && 
                <div className='m-4 relative top-14'> 
                  <div className='text-gray-400 '>
                    Your order will be completed by: {order.RiderName}
                  </div>
                  <div className='text-gray-400 '>
                    Rider's Contact: +91{order.RiderPhone}
                  </div>
                </div>
              }
            <div className="px-6 py-4 flex mt-16">
                <button
                    className="  text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-4 "
                    onClick={toggleDetails}
                >
                    {showDetails ? "Hide Details" : "Show Details"}
                </button>
                <button onClick={() => setShowOrderTracking(!showOrderTracking)} className="text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Track Order</button>
                
                  {showOrderTracking && <OrderTracking order={order} />}
            </div>
            {showDetails && (
                <div className="px-6 py-4">
                    <div className="mb-4 border-b border-gray-400">
                        <h3 className="text-md font-semibold mb-2">Pickup Details</h3>
                        <p className="mb-2">{order.PickupDetails.address}</p>
                        <p className="mb-2">Phone: {order.PickupDetails.Phone}</p>
                        <p>Locality: {order.PickupDetails.Locality}</p>
                    </div>
                    <div className="mb-4 border-b border-gray-400">
                        <h3 className="text-md font-semibold mb-2">Delivery Details</h3>
                        <p className="mb-2">{order.DeliveryDetails.address}</p>
                        <p className="mb-2">Phone: {order.DeliveryDetails.Phone}</p>
                        <p>Locality: {order.DeliveryDetails.Locality}</p>
                    </div>
                    <div>
                        <p>Weight: {order.weight}</p>
                        <p>Parcel Value: {order.parcelValue}</p>
                        <p>charges: {order.price}</p>
                        <p>Payment Type: {order.paymentType}</p>
                        <p>Instruction: {order.instruction}</p>
                        <p>Order ID: {order._id}</p>
                    </div>
                </div>
            )}
            {order.completed===true && <div className='relative'>
              <div className='absolute text-red-500 right-1 bottom-0'>delivered</div>
            </div>
            }
        </div>
    );
}

export default OrderCard;
