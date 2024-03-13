/* eslint-disable react/prop-types */
import React, { useState } from 'react';

function OrderCard({ order }) {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div className="bg-gray-100 shadow-lg rounded-lg overflow-hidden mb-4">
            <div className="px-6 py-4 text-lg font-semibold">
                {order.Item} - Order ID: {order._id}
            </div>
            <div className="px-6 py-4 flex">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-4 "
                    onClick={toggleDetails}
                >
                    {showDetails ? "Hide Details" : "Show Details"}
                </button>
                <button className="bg-red-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Track Order</button>
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
