/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import 'react-datepicker/dist/react-datepicker.css';

const EditOrderScreen = ({ order }) => {
  const map_key = import.meta.env.VITE_MAP_API_KEY;
  
  const [pickupName,setPickupName] = useState(order.PickupDetails.name);
  const [deliveryName,setDeliveryName] = useState(order.DeliveryDetails.name);
  const [price, setPrice] = useState(order.price);
  const [newPrice,setNewPrice] = useState('');
  const [distance, setDistance] = useState(order.distance || '');
  const [weight, setWeight] = useState(order.weight || '');
  const [parcelValue, setParcelValue] = useState(order.parcelValue || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState(order.instruction || '');
  const [instruction, addInstruction] = useState(order.instruction || '');
  const [Item, setItem] = useState(order.Item || '');
  const [paymentType, setPaymentType] = useState(order.paymentType || '');
  const [added, setAdded] = useState(false);
  const [pickupPhoneNumber, setPickupPhoneNumber] = useState(order.PickupDetails.Phone || '');
  const [pickupFlatDetails, setPickupFlatDetails] = useState(order.PickupDetails.Locality || '');
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState(order.DeliveryDetails.Phone || '');
  const [deliveryFlatDetails, setDeliveryFlatDetails] = useState(order.DeliveryDetails.Locality || '');
  const [hour, setHour] = useState(order.Time.hours || 1);
  const [minute, setMinute] = useState(order.Time.minutes || 0);
  const [ampm, setAMPM] = useState(order.Time.meridian || 'AM');
  const [success, setSuccess] = useState(false);
  const [libraries,setLibraries] = useState(['places']);
  
  let originRef = useRef(order.PickupDetails.address || '');
  let destinationRef = useRef(order.DeliveryDetails.address || '');

  const handleHourChange = (event) => setHour(event.target.value);
  const handleMinuteChange = (event) => setMinute(event.target.value);
  const handleAMPMChange = (event) => setAMPM(event.target.value);
  const handlePickupPhoneNumberChange = (event) => setPickupPhoneNumber(event.target.value);
  const handlePickupFlatDetailsChange = (event) => setPickupFlatDetails(event.target.value);
  const handleDeliveryPhoneNumberChange = (event) => setDeliveryPhoneNumber(event.target.value);
  const handleDeliveryFlatDetailsChange = (event) => setDeliveryFlatDetails(event.target.value);
  const handleParcelValueChange = (e) => setParcelValue(e.target.value);
  const handleDeliveryInstructionsChange = (event) => setDeliveryInstructions(event.target.value);
  const handleItemChange = (value) => setItem(value);
  const handleWeightChange = (value) => setWeight(value);
  const handlePikcupNameChange = (value) => setDeliveryName(value);
  const handleDeliveryNameChange = (value) => setPickupName(value);

  useEffect(()=>{
    // console.log(price, order.price);
    if(weight  && distance ){
      calculatePrice()
    }
  },[weight ,parcelValue, distance,calculatePrice])

  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      setPrice(0);
    } else {
      hasMounted.current = true;
    }
  }, [distance, originRef, destinationRef, parcelValue, weight]);

  const user= localStorage.getItem("user");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: map_key,
    libraries,
  });
  
  if (!isLoaded) {
    return <Loading />;
  }

  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function displayRazorpay() {
  const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  // creating a new order
  const result = await axios.post("https://api.pikkro.com/api/payments/orders",{price:newPrice});

  if (!result) {
      alert("Server error. Are you online?");
      return;
  }

  // Getting the order details back
  const { amount, id: order_id, currency } = result.data;

  const options = {
      key: import.meta.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Pikkro.com",
      description: `Your order for delivery from ${ originRef.current.value} to ${destinationRef.current.value}` ,
      image: "../../images/PikkroLogo.jpeg",
      order_id: order_id,
      handler: async function (response) {
          const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
          };

          const result = await axios.post("https://api.pikkro.com/api/payments/success", data);

          alert(result.data.msg);
      },
      prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
      },
      notes: {
          address: "114, Street no 16, Wazirabad Village, New delhi, 110084",
      },
      theme: {
          color: "#61dafb",
      },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}


function calculatePrice(){
  const distanceInKm = parseFloat(distance); 
  const itemweight=parseInt(weight);
  const itemvalue= parseInt(parcelValue);
  // console.log(typeof distanceInKm)
  let newprice=0;
  if(distanceInKm<=3){
    newprice = 30;
  }
  else
  if(distanceInKm>3){
    newprice = Math.round((30) + (distanceInKm-3)* (7));
  }
  if(itemweight === 10){
    newprice = (price + 50)
  }
  if(itemweight === 15){
    newprice = (price + 100)
  }
  if(itemvalue>1000){
    newprice = (price + itemvalue*(0.01))
  }
  if(order.paymentType==="online")
  {
    if(order.price < newprice)
    {
      setNewPrice(newprice-order.price);
    }
  }
  setNewPrice(newprice);
}

async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
    return
    }
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    travelMode: google.maps.TravelMode.DRIVING,
    })
    setDistance(results.routes[0].legs[0].distance.text)
    // setDuration(results.routes[0].legs[0].duration.text)
    console.log(distance);
}


const handlePayment=(value)=>{
setPaymentType(value);
if(value==="online")
{
  displayRazorpay();
}
}

  const saveInstruction = () => {
    if (deliveryInstructions) {
      addInstruction(deliveryInstructions);
      setAdded(true);
    }
  };



  async function handleSubmit() {
    const orderData = {
      Item,
      weight,
      parcelValue,
      price:newPrice,
      paymentType,
      PickupDetails: {
        name:pickupName,
        address: originRef.current.value,
        Phone: pickupPhoneNumber,
        Locality: pickupFlatDetails,
      },
      DeliveryDetails: {
        name:deliveryName,
        address: destinationRef.current.value,
        Phone: deliveryPhoneNumber,
        Locality: deliveryFlatDetails,
      },
      Time: {
        hours: hour,
        minutes: minute,
        meridian: ampm,
      },
      instruction,
    };

    try {
      const response = await axios.patch(`https://api.pikkro.com/api/orders/update/${order._id}`, orderData);
      if (response.data.success) {
        setSuccess(true);
        Swal.fire('Order updated successfully');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center w-auto relative mt-4 p-4">
      {/* <button className="border border-gray-500 text-black p-1 m-1 absolute left-2" onClick={() => navigate('/')}>
        Back
      </button> */}
      <h1 className="text-3xl font-bold m-12">Edit Your Order</h1>
      <div className="w-full md:w-2/3">
        <div className="shadow-md">
          <div className="flex">
            <p className="font-semibold mr-4 my-4">Select pickup time:</p>
            <select value={hour} onChange={handleHourChange} className="border border-gray-500 mr-2">
              {[...Array(12)].map((_, index) => (
                <option key={index + 1} value={(index + 1).toString().padStart(2, '0')}>
                  {(index + 1).toString().padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className="font-semibold my-4 mr-2">:</span>
            <select value={minute} onChange={handleMinuteChange} className="border border-gray-500 mr-2">
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
            <select value={ampm} onChange={handleAMPMChange} className="border border-gray-500 ml-2">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <p className="text-gray-700 my-2">Ideal delivery time is <b>90 minutes</b> from the time of pickup</p>
        </div>
        <div className="my-8 shadow-md">
          <p className="font-semibold mb-2">Select Item:</p>
          <div className="md:flex text-blue-500 grid grid-cols-3 gap-4">
            {['Food', 'Clothes', 'Gifts', 'Docs', 'Grocery', 'Medicine', 'Others'].map((item) => (
              <button
                key={item}
                className={`border border-gray-400 rounded p-2 mx-4 w-fit ${Item === item && 'bg-blue-500 text-white'}`}
                onClick={() => handleItemChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="shadow-md">
          <p className="font-semibold mb-2">Weight:</p>
          <div className="md:flex text-blue-500 grid grid-cols-2 gap-4">
            {['0kg', '10kg', '15kg', '21kg'].map((w) => (
              <button
                key={w}
                className={`w-fit border border-gray-400 rounded p-2 mx-4 ${weight === w && 'bg-blue-500 text-white'}`}
                onClick={() => handleWeightChange(w)}
              >
                {w === '0kg' ? 'Up to 10 kg' : w === '10kg' ? '10-15 kg' : w === '15kg' ? '15-20 kg' : 'greater than 20 kg'}
              </button>
            ))}
          </div>
        </div>
        <div className="my-8 shadow-md">
          <div className="flex text-gray-700">
            <p className="font-semibold mb-2 mr-4 text-black">Parcel Value: ₹</p>
            <input className="border border-gray-500" value={parcelValue} placeholder=" optional" onChange={handleParcelValueChange} />
          </div>
          <div className="text-gray-700 my-28 mt-5">
            <p>
              We ask for parcel value to provide the most secure delivery facilities to you. We charge only 1% extra according to parcel value for secure
              delivery <b>Max Parcel Value: ₹50,000</b>
            </p>
          </div>
        </div>
        <div className="mb-4 flex flex-col shadow-md">
          <p className="font-semibold mb-2 bg-gray-700 text-white text-center">Pickup details:</p>
          <Autocomplete>
            <input type="text" className="border border-gray-400 rounded p-2 mr-2 w-full my-2" placeholder="Pickup address" ref={originRef} defaultValue={order.PickupDetails.address} required />
          </Autocomplete>
          <input
            type="text"
            className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
            placeholder="Flat/House No./Locality"
            value={pickupName}
            onChange={handlePikcupNameChange}
          />
          <input
            type="text"
            className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
            placeholder="Phone Number"
            value={pickupPhoneNumber}
            onChange={handlePickupPhoneNumberChange}
          />
          <input
            type="text"
            className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
            placeholder="Flat/House No./Locality"
            value={pickupFlatDetails}
            onChange={handlePickupFlatDetailsChange}
          />
        </div>
        <div className="mb-4 flex flex-col shadow-md">
          <p className="font-semibold mb-2 bg-gray-700 text-white text-center">Delivery details:</p>
          <Autocomplete>
            <input
              type="text"
              className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
              placeholder="Delivery address"
              ref={destinationRef}
              defaultValue={order.DeliveryDetails.address}
              required
            />
          </Autocomplete>
          <input
            type="text"
            className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
            placeholder="Flat/House No./Locality"
            value={deliveryName}
            onChange={handleDeliveryNameChange}
          />
          <input
            type="text"
            className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
            placeholder="Phone Number"
            value={deliveryPhoneNumber}
            onChange={handleDeliveryPhoneNumberChange}
          />
          <input
            type="text"
            className="border border-gray-400 rounded p-2 mr-2 w-full my-2"
            placeholder="Flat/House No./Locality"
            value={deliveryFlatDetails}
            onChange={handleDeliveryFlatDetailsChange}
          />
        </div>
        <div className="mb-4 shadow-md">
          <p className="font-semibold mb-2">Delivery Instructions (Optional):</p>
          <textarea
            className="border border-gray-400 rounded p-2 w-full"
            value={deliveryInstructions}
            onChange={handleDeliveryInstructionsChange}
            placeholder="Any specific instructions for the delivery?"
          />
          <button
            className="border border-gray-500 text-black p-2 m-2"
            onClick={saveInstruction}
          >
            {added ? "Instructions Added" : "Add Instructions"}
          </button>
        </div>
        <div className="mb-4 shadow-md">
          <p className="font-semibold mb-2">Payment Type:</p>
          <select
            className="border border-gray-400 rounded p-2 w-full"
            value={paymentType}
            onChange={(e) => handlePayment(e.target.value)}
          >
            <option value="" disabled>Select Payment Type</option>
            <option value="online" >Online</option>
            <option value="cash" >Cash on Delivery (COD)</option>
            <option value="cash" >Cash on Pickup (COP)</option>
          </select>
        </div>
        {price>0 && 
        <div className='flex justify-center'>
         <button className=' text-green-700'>Before Edit Price :₹{price}</button>
        </div>
        }
        {newPrice==='' && 
        <div className='flex justify-center '>
         <button onClick={calculateRoute} className='p-1  rounded-md bg-green-700 text-white'>Check New Price</button>
        </div>}
        {newPrice && 
        <div className='flex justify-center '>
          <button className='bg-red-500 rounded-md p-1 text-white'>New Price : ₹{newPrice}</button>
        </div>
        }
        <div className="flex  ">
          <button
            className="bg-blue-500 text-white p-2 ml-2 rounded mt-6"
            onClick={handleSubmit}
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderScreen;

