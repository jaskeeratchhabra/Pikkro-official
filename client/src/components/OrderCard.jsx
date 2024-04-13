/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {useNavigate} from "react-router"
function OrderCard({ order }) {

    const navigate  = useNavigate();
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };
    const handleEdit=()=>{
        // console.log(typeof order.Date)
        const date = new Date(order.Date)
        console.log(date)
        navigate("/create-order")
    }

    return (
        <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden mb-4 relative">
             <div className="absolute top-1 right-1 text-red-500" onClick={handleEdit}>
                Edit
             </div>
            <div className="px-6 py-4 text-lg font-semibold">
                {order.Item} - Order ID: {order._id}
            </div>
            <div className="px-6 py-4 flex">
                <button
                    className=" border-b-4 border-blue-700  text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-4 "
                    onClick={toggleDetails}
                >
                    {showDetails ? "Hide Details" : "Show Details"}
                </button>
                <button className="border-b-4 border-blue-700  text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Track Order</button>
                <button className="border-b-4 border-blue-700  text-gray-700 font-bold py-2 px-4  ml-4 rounded focus:outline-none focus:shadow-outline">
                Cancel Order</button>
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
                        <p>Price: {order.price}</p>
                        <p>Payment Type: {order.paymentType}</p>
                        <p>Instruction: {order.instruction}</p>
                        <p>Date: {order.Date}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderCard;
