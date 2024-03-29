/* eslint-disable no-undef */
import { useState ,useRef, useEffect} from 'react';
import Loading from '../components/Loading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";

import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'

function Orderscreen() {
  
  const map_key= import.meta.env.VITE_MAP_API_KEY;
  const [price,setPrice] = useState("");
  const [distance,setDistance]=useState("")
  
  const [weight, setWeight] = useState('');
  const [parcelValue, setParcelValue] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [instruction,addInstruction]=useState("");
  const [Item,setItem] =useState("");
  const [paymentType,setPaymentType]=useState("");

  const [selectedDate, setSelectedDate] = useState("");
  
  const [added,setAdded]=useState(false);
  
  let originRef = useRef("");
  let destinationRef = useRef(""); 

   // State variables for pickup details
   const [pickupPhoneNumber, setPickupPhoneNumber] = useState('');
   const [pickupFlatDetails, setPickupFlatDetails] = useState('');

   // State variables for delivery details
   const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState('');
   const [deliveryFlatDetails, setDeliveryFlatDetails] = useState('');

   const [success,setSuccess]=useState(false);


   // Function to handle changes in pickup phone number
   const handlePickupPhoneNumberChange = (event) => {
     setPickupPhoneNumber(event.target.value);
    };
    
  // Function to handle changes in pickup flat details
  const handlePickupFlatDetailsChange = (event) => {
    setPickupFlatDetails(event.target.value);
  };

  // Function to handle changes in delivery phone number
  const handleDeliveryPhoneNumberChange = (event) => {
    setDeliveryPhoneNumber(event.target.value);
  };
  
  // Function to handle changes in delivery flat details
  const handleDeliveryFlatDetailsChange = (event) => {
    setDeliveryFlatDetails(event.target.value);
  };
  
  
  
  useEffect(()=>{
    if(weight  && distance ){
      calculatePrice()
    }
  },[weight ,parcelValue, distance])
  
  // useEffect(()=>{
    //   if(originRef.current && destinationRef.current){
      //     calculateRoute()
      // }
      // },[originRef , destinationRef])
      
      function calculatePrice(){
        const distanceInKm = parseFloat(distance); 
        const itemweight=parseInt(weight);
        const itemvalue= parseInt(parcelValue);
        // console.log(typeof distanceInKm)
        let price=0;
        if(distanceInKm<=3){
          price = 30;
        }
        else
        if(distanceInKm>3){
          price = Math.round((30) + (distanceInKm-3)* (7));
        }
        if(itemweight === 10){
          price = (price + 50)
        }
        if(itemweight === 15){
          price = (price + 100)
        }
        if(itemvalue>1000){
          price = (price + itemvalue*(0.01))
        }
        setPrice(price);
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
  }
  const handleItemChange = (value)=>{
      setItem(value)
  }     
  
  const handleWeightChange = (value) => {
    setWeight(value);
  };
  
  const saveInstruction=()=>{
    if(deliveryInstructions){
      addInstruction(deliveryInstructions);
      console.log(instruction);
      setAdded(true);
    }
    else{
      return;
    }
  }
  const handleParcelValueChange = (e) => {
    setParcelValue(e.target.value);
  };
  
  const handleDeliveryInstructionsChange = (event) => {
    setDeliveryInstructions(event.target.value);
  };
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: map_key,
    libraries: ['places'],
  })
  
  if (!isLoaded) {
    return <Loading/>
  }
  

  async function handleSubmit(){
  
    if(!localStorage.getItem("user"))
    {
      alert("please login to place order");
      return;
    }
    const orderData = {
      userPhone: (JSON.parse(localStorage.getItem("user"))).phone,
      Item,
      weight,
      parcelValue,
      price,
      paymentType,
      PickupDetails: {
        address: originRef.current.value,
        Phone: pickupPhoneNumber,
        Locality: pickupFlatDetails
      },
      DeliveryDetails: {
        address: destinationRef.current.value,
        Phone: deliveryPhoneNumber,
        Locality: deliveryFlatDetails
      },
      instruction,
      Date: String(selectedDate)
    };
    console.log(orderData);
    try{
      const data= (await (axios.post("/api/orders/neworder",orderData))).data;
      if(data)
      {
        console.log("order placed successfully");
        console.log(data);
        setSuccess(true);
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const today = new Date();
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  return (
    <div className="flex flex-col items-center w-auto">
      <h1 className="text-3xl font-bold m-12">Create Your Order</h1>
      
      <div className="w-full md:w-2/3">
      <div className="flex mx-4 ">
        <p className="font-semibold mr-2 my-4">Select delivery date:</p>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={today}
          inline
          dateFormat="MM/dd/yyyy"
          placeholderText="Select a date"
          wrapperClassName="horizontal-datepicker"
          calendarClassName="horizontal-calendar"
        />
    </div>
      <div className="my-8 shadow-lg">
          <p className="font-semibold mb-2">Select Item:</p>
          <div className="flex text-blue-500 ">
            <button className={`border border-gray-400 rounded p-2 mx-4 ${Item === "Food" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Food")}>Food</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${Item === "Clothes" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Clothes")}>Clothes</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${Item === "Gifts" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Gifts")}>Gifts</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${Item === "Documents" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Documents")}> Documents</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${Item === "Grocery" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Grocery")}> Grocery</button>
            <button className={`border  border-gray-400 rounded p-2 mx-4 ${Item === "Medicine" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Medicine")}> Medicine</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${Item === "Others" && 'bg-blue-500 text-white'}`} onClick={() => handleItemChange("Others")}> Others</button>
          </div>
        </div>


        <div className="my-8 shadow-lg">
          <p className="font-semibold mb-2">Weight:</p>
          <div className="flex text-blue-500 ">
            <button className={`border border-gray-400 rounded p-2 mx-4 ${weight === '0kg' && 'bg-blue-500 text-white'}`} onClick={() => handleWeightChange('0kg')}>Up to 10 kg</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${weight === '10kg' && 'bg-blue-500 text-white'}`} onClick={() => handleWeightChange('10kg')}>10-15 kg</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${weight === '15kg' && 'bg-blue-500 text-white'}`} onClick={() => handleWeightChange('15kg')}>15-20 kg</button>
            <button className={`border border-gray-400 rounded p-2 mx-4 ${weight === '21kg' && 'bg-blue-500 text-white'}`} onClick={() => handleWeightChange('21kg')}>greater than 20 kg</button>
          </div>
        </div>
        


        <div className="my-8 shadow-lg">
          <div className="flex text-gray-700">
          <p className="font-semibold mb-2 mr-4">Parcel Value:</p>
           <input className='border border-gray-500' value={parcelValue} placeholder='   optional'  onChange={handleParcelValueChange}/>
          </div>
          <div className='text-gray-700 my-36 mt-5 '>
             <p> We ask for parcel value to provide most secure delivery fascilities to you , we charge only 1% extra according to parcel value for secure delivery <b>Max Parcel Value: ₹50,000</b></p>
          </div>
        </div>

        <div className="mb-4 flex flex-col shadow-lg">
          <p className="font-semibold mb-2 bg-gray-700 text-white text-center">Pickup details:</p>
          <Autocomplete>
            <input type="text" className="border border-gray-400 rounded p-2 mr-2 w-full my-2" placeholder="Pickup address" ref={originRef} required />
          </Autocomplete>
          <input type="text" className="border border-gray-400 rounded p-2 mr-2 w-full my-2" placeholder="Phone Number" value={pickupPhoneNumber}
          onChange={handlePickupPhoneNumberChange} />

          <Autocomplete>
            <input type="text" className="border border-gray-400 rounded p-2 mr-2 w-full my-2" placeholder="Flat No/Locality/Street/area" 
              value={pickupFlatDetails}
              onChange={handlePickupFlatDetailsChange}
            />
          </Autocomplete>
        </div>
 
        <div className="mb-4 flex flex-col shadow-lg">
          <p className="font-semibold mb-2 bg-gray-700 text-white text-center">Delivery details:</p>
          <Autocomplete>
            <input type="text" className="border border-gray-400 rounded p-2 mr-2 w-full my-2" placeholder="Delivery address" ref={destinationRef} required/>
          </Autocomplete>
          <input type="text" className="border border-gray-400 file:rounded p-2 mr-2 w-full my-2" placeholder="Phone Number" 
            value={deliveryPhoneNumber}
            onChange={handleDeliveryPhoneNumberChange}
          />
          <Autocomplete>
           <input type="text" className="border border-gray-400 rounded p-2 mr-2 w-full my-2" placeholder="Flat No/Locality/Street/area" 
             value={deliveryFlatDetails}
             onChange={handleDeliveryFlatDetailsChange}
           />
          </Autocomplete>
        </div>
        <div className="mb-96 mt-12 flex flex-col">
          <label className="font-semibold mb-2">Delivery Instructions:</label>
          <textarea
            className="border border-blue-500 rounded p-2 mr-2 w-full my-2"
            rows="4"
            value={deliveryInstructions}
            onChange={handleDeliveryInstructionsChange}
            placeholder="Enter any specific delivery instructions here..."
          />
          {!added && <button className='bg-blue-500 w-12 text-white rounded-sm ' onClick={saveInstruction}>Add</button>}
          {added && <button className='bg-green-500 w-12 text-white rounded-sm '>Added</button>}
            
          <div className='flex justify-center'>
             {price && <span className='bg-red-500 text-white p-3 my-5 w-3/12 rounded-lg '>Payable amount : ₹ {price} </span>}
             {!price &&  <span className='bg-green-500 text-white p-3 my-5 w-3/12 rounded-lg animate-pulse' onClick={calculateRoute}>click to know pricing details </span>}
           </div>

          <div className='flex flex-col mt-12 font-semibold'>
            <p>Select payment method:</p>
            <div className='flex my-4'>
              <button className={` flex border border-blue-400 rounded p-5 mx-4 text-gray-700 ${ paymentType==="cash" && 'bg-blue-500 text-white'}`} onClick={() => handlePayment('cash')}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
               </svg>
               Cash on pickup
              </button>
              <button className={` flex border border-blue-400 rounded p-5 mx-4 text-gray-700 ${ paymentType==="online" && 'bg-blue-500 text-white'}`} onClick={() => handlePayment('online')}> 
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
               </svg>
               UPI/Wallet, Card
              </button>
            </div>
           </div>
              {!success && <button className='bg-blue-500 text-white p-3 my-5 w-3/12 rounded-lg' onClick={handleSubmit}>Submit Order</button>}
              {success && <button className='bg-green-500 text-white p-3 my-5 w-3/12 rounded-lg'>Order Placed SuccessFully</button>}

           </div>
       </div>
    </div>
  );
}

export default Orderscreen;
