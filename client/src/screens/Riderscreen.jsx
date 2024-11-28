/* eslint-disable react/prop-types */
import {useState,useEffect} from 'react'
import SuccessComponent from '../components/SuccessComponent'
import axios from 'axios';
import Loading from "../components/Loading"
import MapContainer from '../components/MapContainer';
import PopupComponent from '../components/PopupComponent';
import Swal from 'sweetalert2';
import {useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import BankDetailsForm from '../components/BankDetailsForm';

const OrderCard=({orders, handleStatusProp})=>{
  
  const url= import.meta.env.BASE_URL
  const [toggleP,settoggleP] = useState(false);
  const [toggleD,settoggleD] = useState(false);
  const [status,setStatus] = useState("new");
  const [loading,setLoading] = useState(false);
  const [RiderAccepted,setRider] = useState("");
  const [popup,setPopup] = useState(false);
  const riderName = (JSON.parse(localStorage.getItem("user"))).name
  const RiderPhone = (JSON.parse(localStorage.getItem("user"))).phone
  const [cancel,setCancel] = useState(false);
  const paymentType = orders.paymentType;
  const user=JSON.parse(localStorage.getItem("user"));
  const [OtpPickupStatus,setOtpPickupStatus] = useState("");
  const [OtpDeliveryStatus,setOtpDeliveryStatus] = useState("");
  const [Pickupotp, setPickupOTP] = useState(['', '', '', '', '', '']);
  const [Deliveryotp, setDeliveryOTP] = useState(['', '', '', '', '', '']);
  const [Pickupcode,setPickupCode] = useState("");
  const [Deliverycode,setDeliveryCode] = useState("");
  const refs = useRef([]);

  const handleOTPChange = (index, value, otpType) => {
    const newOTP = otpType === "pickup" ? [...Pickupotp] : [...Deliveryotp];
    newOTP[index] = value;

    console.log(otpType)
    if (otpType === "pickup") {
      setPickupOTP(newOTP);
    } else {
      setDeliveryOTP(newOTP);
    }

    if (value && index < newOTP.length - 1) {
      refs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e, otpType) => {
    if (e.key === 'Backspace' && index > 0) {
      refs.current[index - 1].focus();
    }
  };
  

  // to update state of the order
  useEffect(()=>{
    console.log(orders.accepted,orders.picked,orders.completed)  
    if(orders.completed === true){
      setStatus("completed");
      handleStatusProp("completed");
      console.log("in completed")
    }
    else if(orders.picked === true){
      setStatus("picked");
      handleStatusProp("picked");
      console.log("in picked")
    }
    else if(orders.accepted === true){
      setStatus("accepted")
      handleStatusProp("accepted");
      console.log("in accepted")
    }
  },[orders.completed,orders.picked, orders.accepted])
  

  // function to handle status and to add rider details on state update
  const handleStatus = async (value) => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const _id = orders._id;
    let statusValue;
  
    if (value === "canceled") {
      // Show the SweetAlert2 modal for cancellation confirmation
      const result = await Swal.fire({
        title: "Cancellation",
        text: "Cancellation charge of Rs 40 will be applied",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel"
      });
  
      // If the user confirms the cancellation
      if (!result.isConfirmed) {
        return; // Exit the function if the user cancels the confirmation dialog
      }
  
      statusValue = {
        value: value,
        canceledBy: "rider",
        RiderPhone: userInfo.phone,
        RiderName: userInfo.name
      };
    } else {
      statusValue = {
        value: value,
        RiderPhone: userInfo.phone,
        RiderName: userInfo.name
      };
    }
  
    try {
      setLoading(true);
      const response = await axios.patch(url+`/api/orders/${_id}`, statusValue);
      const result = response.data;
  
      if (result.updatedDocument["accepted"] === true) {
        setRider(result.updatedDocument.RiderPhone);
      }
  
      setStatus((prevStatus) => {
        if (result.updatedDocument[value] === true) {
          return value;
        } else {
          return prevStatus; // Return the previous state if the update was not successful
        }
      });
  
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
  
  // function to hnadle pickup and delivery toggle button
  const handleToggle = (e) =>{
     if(e.target.name==="pickup"){
      settoggleP(!toggleP);
     }
     if(e.target.name==="drop"){
      settoggleD(!toggleD);
     }
  }
  
  const handleGeneration = async (value) => {
    let phone;
    if (value === "pickup") {
      phone = orders.PickupDetails.Phone;
    } else {
      phone = orders.DeliveryDetails.Phone;
    }
    try {
      const data = (await axios.post(url+"/api/users/generateOTP", { number: phone })).data;
      console.log(data);
      if (value === "pickup") {
        setOtpPickupStatus("sent");
        setPickupCode(data);
      } else {
        setOtpDeliveryStatus("sent");
        // console.log(data);
        setDeliveryCode(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVerification = (value) => {
    const otp = value === "pickup" ? Pickupotp.join('') : Deliveryotp.join('');
    const code = value === "pickup" ? Pickupcode : Deliverycode;
   
    console.log(code,otp)
    if (otp === String(code)) {
      if (value === "pickup") {
        setOtpPickupStatus("verified");
      } else {
        setOtpDeliveryStatus("verified");
      }
    } else {
      console.log("OTP verification failed");
    }
  };


  const handleCancel= ()=>{
      setCancel(true);
      handleStatus("canceled");
  }

  return (
    <>
    {loading  &&  <Loading/>}
    <div className='md:w-3/4 w-fit m-2 md:mx-auto rounded-lg p-2 '>
      {popup && <PopupComponent className="absolute top-0" message={`Order ${status} by ${riderName}`}/>}
       <div className= "w-full shadow-xl p-2 m-2 border border-gray-300 relative"> 
          <div className='font-semibold md:text-xl text-gray-700 m-1'>
          {orders.Time && (
              <span>
                Pickup Time: {orders.Time.hours}:{orders.Time.minutes}{" "}
                <span>{orders.Time.meridian}</span>
              </span>
          )}
          </div>
          {
            status === "new" && <div>
             <div className='w-fit '>
              <div className='bg-black text-white rounded-md p-1 mb-3 animate-pulse'>New order</div> 
             </div>

             <div className='md:right-2 md:mb-3 font-semibold'>Your earning: ₹{((0.8)* orders.price).toFixed(2)}</div>
              <MapContainer pickupAddress={orders.PickupDetails.address} deliveryAddress={orders.DeliveryDetails.address} status ={status} setDistanceToPickupProp={(distance)=>{handlePickupDistance(distance)}}/>
               <div className='mb-5 mt-5'>
                <ol className=''>
                  <b className='underline'>Pickup: </b>
                  <li>
                      <ul>
                      { 
                        orders.PickupDetails && 
                        Object.keys(orders.PickupDetails).length === 4 && 
                        orders.PickupDetails.name && (
                          <li><span className='font-semibold   mr-2 '>Name : </span> {orders.PickupDetails.name}</li>
                      )}

                        <li><span className='font-semibold mr-2 '>Address : </span>{orders.PickupDetails.address}</li>
                        <li><span className='font-semibold   mr-2 '>Phone : </span>{orders.PickupDetails.Phone.replace(/(\d{4})$/, 'XXXX')}</li>
                      </ul>
                      
                  </li>
                  <hr/>
                  <b className='underline'>Delivery: </b>
                  <li>
                    <ul type="">
                    { 
                        orders.DeliveryDetails && 
                        Object.keys(orders.DeliveryDetails).length === 4 && 
                        orders.DeliveryDetails.name && (
                          <li><span className='font-semibold   mr-2 '>Name : </span>{orders.DeliveryDetails.name}</li>
                      )}
                      <li><span className='font-semibold   mr-2 '>Address : </span>{orders.DeliveryDetails.address}</li>
                      <li><span className='font-semibold   mr-2 '>Phone : </span>{orders.DeliveryDetails.Phone.replace(/(\d{4})$/, 'XXXX')}</li>
                    </ul>
                  </li>
                  <b className=''>Instructions:</b>
                  <li>
                    {orders.instruction}
                  </li>
                </ol>
               </div>
              <button onClick={()=>{handleStatus("accepted")}} className='rounded-md bg-green-500 text-white p-1 absolute right-5 bottom-5 '>Accept</button>
            </div>
          }
          {status!=="new" && <div className=''>
             <div className='absolute top-10 right-4 font-semibold '>order value:  ₹{orders.price}</div>
             <div className='pt-3'>
              <MapContainer pickupAddress={orders.PickupDetails.address} deliveryAddress={orders.DeliveryDetails.address} status ={status}/>
             </div>
             <div className=" flex justify-between m-10 ">
               <div>
                   <button onClick={handleToggle} name = "pickup" className='rounded-md bg-black text-white p-1 mr-2'>pickup</button>
                   {toggleP && <div className='flex flex-col border border-gray-200 mx-auto'>
                    { 
                        orders.PickupDetails && 
                        Object.keys(orders.PickupDetails).length === 4 && 
                        orders.PickupDetails.name && (
                          <li>Name: {orders.PickupDetails.name}</li>
                      )}
                     <span><b>Address: </b> {orders.PickupDetails.address}</span>
                     <span><b>Phone:</b> {orders.PickupDetails.Phone}</span>
                     <span><b>Locality:</b> {orders.PickupDetails.Locality}</span>
                     {!OtpPickupStatus && <button className='bg-blue-500 text-white w-fit p-1 rounded-md' onClick={()=>handleGeneration("pickup")}>Send OTP</button>}
                     {OtpPickupStatus==="sent" && <div>
                        <h2 className='mt-3 ml-1'>Enter OTP</h2>
                        <div className='flex'>
                            <div className="w-fit ">
                                {Pickupotp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="h-5 w-5 border rounded-md border-black mx-1"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value,"pickup")}
                                        onKeyDown={(e) => handleKeyDown(index, e,"pickup")}
                    
                                        ref={(el) => (refs.current[index] = el)}
                    
                                    />
                                ))}
                            </div>
                            <button className='px-1 bg-blue-700 text-white ml-2 rounded-md' onClick={()=>handleVerification("pickup")}>Verify</button>
                        </div>
                    </div>
                   }
                   {
                    OtpPickupStatus==="verified" && <h1 className='text-green-700'>User verified</h1>
                   }
                   </div>
                   }
               </div>
               <div className=''>
                
                   <button name="drop" onClick={handleToggle} className='rounded-md bg-black text-white text-center p-1 ml-2'>Drop</button>
                   {
                     toggleD && <div className='flex flex-col border border-gray-200 mx-auto'>
                     { 
                        orders.DeliveryDetails && 
                        Object.keys(orders.DeliveryDetails).length === 4 && 
                        orders.DeliveryDetails.name && (
                          <li><span className=''>Name: </span>{orders.DeliveryDetails.name}</li>
                      )}
                     <span><b>Address: </b>{orders.DeliveryDetails.address}</span>
                     <span><b>Phone:</b> {orders.DeliveryDetails.Phone}</span>
                     <span><b>Locality:</b> {orders.DeliveryDetails.Locality}</span>
                     {!OtpDeliveryStatus && <button className='bg-blue-500 text-white w-fit p-1 rounded-md' onClick={()=>{handleGeneration("delivery")}}>Send OTP</button>}
                     {
                      OtpDeliveryStatus==="sent" && <div>
                        <h2 className='mt-3 ml-1'>Enter OTP</h2>
                        <div className='flex'>
                            <div className="w-fit ">
                                {Deliveryotp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="h-5 w-5 border rounded-md border-black mx-1"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value,"delivery")}
                                        onKeyDown={(e) => handleKeyDown(index, e,"delivery")}
                    
                                        ref={(el) => (refs.current[index] = el)}
                    
                                    />
                                ))}
                            </div>
                            <button className='px-1 bg-blue-700 text-white ml-2 rounded-md' onClick={()=>handleVerification("delivery")}>Verify</button>
                        </div>
                    </div>
                     }
                     {
                      OtpDeliveryStatus==="verified" && <h1 className='text-green-500'>User verified</h1>
                     }
                   </div>
                   }
               </div>

             </div>
             <div className='text-center m-3 border-b-2 border-blue-200'>User's Phone : +91{user.phone}</div>
               <div className='w-auto flex justify-center mb-10'> 
               {paymentType === "cash on delivery" ? (
                  <div className='p-1 border border-b-4 border-gray-500 w-fit rounded-md mb-4'>
                    Collect cash on delivery: ₹{orders.price}
                  </div>
                ) : paymentType === "cash on pickup" ? (
                  <div className='p-1 border border-b-4 border-gray-500 w-fit rounded-md mb-4'>
                    Collect cash on pickup: ₹{orders.price}
                  </div>
                ) : (
                  <div className='p-1 border border-b-4 border-gray-500 w-fit rounded-md mb-4'>
                    Prepaid
                  </div>
                )}

               </div>
            </div>
           }
          <div className='flex'>
          
           {orders.picked===false && orders.accepted===true && <button className='absolute left-5 bottom-5 p-1 rounded-md  bg-purple-700 text-white' onClick={handleCancel}>Cancel</button>}
           {status === "new" ? <button onClick={()=>{handleStatus("accepted")}} className='rounded-md bg-green-500 text-white p-1 absolute right-5 bottom-5 '>Accept</button> :
           status === "accepted" ? <button onClick={()=>{handleStatus("picked")}} className='rounded-md bg-blue-500 text-white p-1 absolute right-5 bottom-5 '>Picked</button>:
            status==="picked" ? <button onClick={()=>{handleStatus("completed")}}className='rounded-md bg-red-500 text-white p-1 absolute right-5 bottom-5 '>Delivered</button> :
             <h1 className=' text-red-700 p-1 absolute right-3 bottom-3 '> delivered</h1>}
          {/* <button className='rounded-sm bg-red-500 text-white mx-auto p-1'>Deny</button> */}
         </div>
       </div>
    </div>
    </>
  )
}



function Riderscreen() {
  const url= import.meta.env.BASE_URL
  const [option,selectOption] = useState("");
  const [neworders, setNeworders] = useState([]);
  const [loading,setLoading] = useState(false);
  const [orderInRange,setOrderInRange] = useState([]);
  const isAdmin = JSON.parse(localStorage.getItem("user")).isAdmin;
  const RiderContact = JSON.parse(localStorage.getItem("user")).phone;
  const [Myorder, setMyorder] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  // const [pickupLocation ,setPickupLocation] = useState(null);
  const [Activeorders,setActiveOrder] = useState([]);
  const [status,setStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus,setPaymentStatus] = useState("due");
  const [settledArray,setSettledArray] = useState([]);
  const [paymentRequest, setPaymentRequest] = useState(false)
  const [incompleteRequests, setIncompleteRequests] = useState([]);
  const user= JSON.parse(localStorage.getItem("user"));
  const [alltimeearning, setAlltimeearnings] = useState(0);

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };


  function calculateEarning() {
    let totalEarning = 0;
    Myorder.forEach((order) => {
      if (order.canceled === false && order.completed === true) {
        totalEarning += parseFloat((order.price * 0.8).toFixed(2));
      }
    });
    setAlltimeearnings(totalEarning)
  }
  
   useEffect(()=>{
     calculateEarning();
   }, [Myorder])
  const [isOn, setIsOn] = useState(()=>{
    const saved = localStorage.getItem('isOn');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [bankformstatus,setBankformstatus] = useState(false);
  const [editbankform,setEditbankform] = useState(false);

  const navigate = useNavigate()
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };
  
  useEffect(()=>{
    localStorage.setItem('isOn', JSON.stringify(isOn));
    changeDuty();
  },[isOn])
  const changeDuty= async()=>{
    const onDuty = isOn;
    const phone = user.phone
    const obj = {phone, onDuty}
     try{
       await axios.patch(url+`/api/users/:${phone}`,obj)
     }
     catch(error)
     {
        console.log(error.message);
     }
  }

  const [paymentDone,setPaymentDone] = useState(false)
  const handlePaymentStatus=(value)=>{
     setPaymentStatus(value);
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
  console.log(typeof totalAmount)
  const result = await axios.post(url+"/api/payments/orders",{price: totalAmount});
  // if(result.status===200)
    // {
    //   handlePaymentStatus("paid")
    // }
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
      description: `Your pending payment for delivered orders` ,
      image: "../../images/PikkroLogo.jpeg",
      order_id: order_id,
      handler: async function (response) {
          const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
          };

          const result = await axios.post(url+"/api/payments/success", data);
          if(result.message==="success")
          {
            handlePaymentStatus("paid");
            for (const orderId of settledArray) {
              if (orderId) {
                 handlePaymentField(orderId);
              }
            }
          }

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


  const handleStatus=(value)=>{
    setStatus(value);
  }

  const handlePaymentField = async (orderId) => {
    console.log("OrderId:", orderId);
    try {
      const response = await axios.patch(url+'/api/orders/updatepaymentfield', {
        orderId:orderId
      }).data;
      // setPaymentStatus("paid");
      console.log(response);
      // Update the local state or refetch orders to reflect the changes
    } catch (error) {
      console.log(error.message)
      console.error("Error updating payment status", error);
    }
  };

  const settlePayment = () => {
    displayRazorpay();
  };
  
 
useEffect(() => {
  const handlePayments = () => {
    let amount = 0;
    const newSettledSet = new Set(settledArray); // Initialize with current settledArray
    
    Myorder.forEach((order) => {
      if (order.completed===true && order.paymentSettled === false && order.canceled === false) {
        let amountToPay = 0,
          amountToGet = 0;

        if (order.paymentType === 'online') {
          amountToGet = parseFloat((order.price * 0.8).toFixed(2));
        } else {
          amountToPay = parseFloat((order.price * 0.2).toFixed(2));
        }

        newSettledSet.add(order._id);
        amount = amount + amountToPay - amountToGet;
      }
      if(order.canceled && order.canceledBy==="rider" && order.RiderPhone===user.phone)
        {
          amount = amount + 40
        }
    }
  );


    setSettledArray(Array.from(newSettledSet)); // Convert set back to array
    setTotalAmount(amount.toFixed(2));
    console.log(amount);
  };

  handlePayments();
}, [Myorder]);
  
  useEffect(()=>{
    const ordersInrange= neworders.filter((order)=>(order.RiderPhone===RiderContact &&  order.accepted===false))
    const MyPickedOrders = neworders.filter((order)=>(order.RiderPhone === RiderContact && order.accepted===true))
    const ActiveOrders =   neworders.filter((order)=>(order.RiderPhone === RiderContact && order.accepted===true && order.completed===false))
    
    setOrderInRange(ordersInrange);
    setMyorder(MyPickedOrders)
    setActiveOrder(ActiveOrders);
  },[status,RiderContact,option])

  useEffect(()=>{
    const options = {
      enableHighAccuracy: true,
      maximumAge: 10000, // Maximum age of cached position in milliseconds
      timeout: 10000 // Timeout in milliseconds
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error: The Geolocation service failed.', error);
        },
        options
      );
    } else {
      console.error("Error: Your browser doesn't support Geolocation.");
    }
  },[])



  const calculateDistance = (location1, location2) => {
    if (!location1 || !location2) return null;
    const { lat: lat1, lng: lng1 } = location1;
    const { lat: lat2, lng: lng2 } = location2;
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
    
};


  useEffect(()=>{
    neworders.map((order)=>{
      handleOrderInRange(order.PickupDetails.address,order);
   })
  },[neworders])

  const handleOrderInRange = (pickupDetails,order) => {
    if (!pickupDetails) return; 
    
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address: pickupDetails }, (results, status) => {
      if (status === 'OK') {
        const pickupLocation = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        
        if (currentLocation) {
          const distance = parseFloat(calculateDistance(currentLocation, pickupLocation));
          if(distance<=7)
          {
            if (!orderInRange.some((existingOrder) => existingOrder._id === order._id)) {
              setOrderInRange((prev) => [...prev, order]);
            }
          }
        }
      } else {
        console.log(`Geocode was not successful for the following reason: ${status}`);
      }
    });
  };


  const getPendingPayments = async ()=>{
    try{
       const result = (await axios.get(url+"/api/payments/getrequest")).data;
       setIncompleteRequests(result);
       console.log(result)
    }
    catch(error)
    {
       console.log(error.message);
    }
  }
  
  const handlePaymentRequest = async () => {
      const total = -1 * totalAmount
      const paymentData = {
                   riderName :user.name,
                   riderPhone :user.phone,
                   amount : total
                  }
      try{
         const data = (await axios.post(url+"/api/payments/settlement", paymentData));
         console.log(data);
         if(data.status===200)
         { 
            setPaymentRequest(true);
            for (const orderId of settledArray) {
              if (orderId) {
                 handlePaymentField(orderId);
              }
            }
         }
      }
      catch(error)
      {
         console.log(error.message);
      }
  };

  const handleClick=(value)=>{
     selectOption(value)
     if(value==="payment requests")
      {
        getPendingPayments();
      }
  }
 
  const PaymentDone=async(reqId)=>{
    try{
      const data= (await axios.patch(url+`/api/payments/${reqId}`)).data;
      setPaymentDone(true);
      console.log(data);
    }
    catch(error)
    {
      console.log(error.message);
    }

  }
  
  
  useEffect(()=>{
    
    async function getOrders(){
      try{
        setLoading(true)
        const result =  (await axios.get(url+"/api/orders/getorder")).data;
        const newOrders= result.filter((order)=>(order.accepted===false && order.canceled===false ));
        const MyPickedOrders = result.filter((order)=>(order.RiderPhone === RiderContact && order.accepted===true))
        const ActiveOrders =   result.filter((order)=>(order.canceled===false && order.RiderPhone === RiderContact && order.accepted===true && order.completed===false))
        
        const parseDateTime = (dateString, time) => {
          const [month, day, year] = dateString.split(' ');
          let { hours, minutes, meridian } = time;
          
          // Convert month abbreviation to month index
          const monthIndex = new Date(`${month} 1`).getMonth();
          
          // Convert 12-hour time to 24-hour time
          if (meridian.toLowerCase() === 'pm' && hours !== 12) {
            hours += 12;
          } else if (meridian.toLowerCase() === 'am' && hours === 12) {
            hours = 0;
          }
          
          return new Date(year, monthIndex, day, hours, minutes);
        };
        
        // Sort newOrders by most recent combined datetime
        newOrders.sort((a, b) => parseDateTime(b.Date, b.Time) - parseDateTime(a.Date, a.Time));

        setMyorder(MyPickedOrders)
        setNeworders(newOrders);
        setActiveOrder(ActiveOrders);
        setLoading(false);
      }
      catch(error){
        setLoading(false)
       console.log(error.message);
      }
    }
    getOrders();
  },[option])

  const handleBankDetails=()=>{
    setBankformstatus((prev)=>(!prev));
  }

  const handleEditBankDetails=()=>{
  setEditbankform((prev)=>(!prev));
}
return (
  <div className='relative'>
    {loading && <Loading />}
    {option === "" && <div className='text-center text-xl text-gray-700 font-semibold animate-pulse'>Select options to continue</div>}
    { user && isAdmin && <button className='border shadow-md p-1' onClick={() => navigate("/admin")}>Switch to admin screen</button>}
    <div className='absolute md:right-4 right-10 md:m-4 mt-2 flex items-center'>
      <div
        className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-300'}`}
        onClick={toggleSwitch}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </div>
      <span className='ml-2'>On Duty</span>
    </div>

    <button onClick={toggleSidebar} className="p-2 rounded-lg bg-gray-100 shadow-lg ml-2 font-semibold">
      {option==="filtered orders" ? "Orders Near You" : option=== "new orders"? "All Orders" :
      option==="earning per order" ? "Earning Per Order" : option==="payment requests"? "Payment Requests" :
      option ==="active orders"?" Active Orders" : "Select Option"}
    </button>
    <div className='flex relative'>
      <div className=''>
      {isSidebarOpen && (

        <div className='mt-10 relative  shadow-lg '>
          <div className="p-2 bg-gray-200 flex flex-col ">
            {user && isAdmin && (
              <button
                onClick={() => handleClick("new orders")}
                className={`${option === "new orders" ? "border-b-4 border-blue-700" : "text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
              >
                All Orders
              </button>
            )}
            <button
              onClick={() => handleClick("filtered orders")}
              className={`${option === "filtered orders" ? "border-b-4 border-blue-700" : "text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
            >
              Orders Near You
            </button>
            <button
              onClick={() => handleClick("active orders")}
              className={`${option === "active orders" ? "border-b-4 border-blue-700" : "text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
            >
              Active Orders
            </button>
            <button
              onClick={() => handleClick("earning per order")}
              className={`${option === "earning per order" ? "border-b-4 border-blue-700" : "text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
            >
              Earning Per Order
            </button>
            {user && isAdmin && (
              <button
                onClick={() => handleClick("payment requests")}
                className={`${option === "payment requests" ? "border-b-4 border-blue-700" : "text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
              >
                Payment Requests
              </button>
            )}
            <div className='flex flex-col w-fit mt-10'>
              <button className='shadow-lg p-1 rounded-lg ml-2' onClick={handleBankDetails}>Submit Bank Details</button>
              <button className='shadow-lg p-1 rounded-lg ml-2 mt-5' onClick={handleEditBankDetails}>Update Bank Details</button>
            </div>
          </div>
          <button className='absolute top-1 right-0 font-semibold text-red-500 mx-1'onClick={toggleSidebar}>☓</button>
        </div>
      )}
      </div>
  
    <div>
     {option === "filtered orders" && (
       <div className='grid grid-cols-1 lg:grid-cols-2 mt-10'>
         {orderInRange.length === 0 ? (
           <h1>No orders found</h1>
         ) : (
           orderInRange.map((order) => (
             <OrderCard
               key={order._id}
               orders={order}
               handleStatusProp={(value) => handleStatus(value)}
             />
           ))
         )}
       </div>
     )}
 
     {option === "new orders" && (
       <div className='grid grid-cols-1 lg:grid-cols-2 mt-5'>
         {neworders.length === 0 ? (
           <h1>No orders found</h1>
         ) : (
           neworders.map((order) => (
             <OrderCard
               key={order._id}
               orders={order}
               handleStatusProp={(value) => handleStatus(value)}
             />
           ))
         )}
       </div>
     )}
 
     {option === "earning per order" && (
       <div className='my-auto grid md:grid-cols-2 grid-cols-1 gap-x-32 gap-y-12 mt-10 relative'>
         {Myorder.map((Myorder) => (
           <div key={Myorder._id} className='min-w-1/2 h-auto p-5 shadow-lg border border-blue-100 relative'>
             <h1 className='mx-2 text-blue-500'>{Myorder.Date}</h1>
             <h1 className='mx-2 text-blue-500'>orderID : {Myorder._id}</h1>
             <hr />
             <div className='grid items-center my-1 relative'>
               <span className='text-Gray-600 font-semibold mx-2'>{Myorder.Item}:</span>
               <span className='mx-2'>Earning on this order: ₹{(0.8 * Myorder.price).toFixed(2)}</span>
               {!Myorder.canceled && Myorder.paymentSettled === false && Myorder.paymentType.split(' ')[0] === "cash" && <span className="mx-2 text-red-500 border-b-2 border-red-500">You owe : ₹{(Myorder.price * 0.2).toFixed(2)}</span>}
               {!Myorder.canceled && Myorder.paymentSettled === false && Myorder.paymentType === "online" && <span className="mx-2 text-green-500 border-b-2 border-green-500">You get : ₹{(Myorder.price * 0.8).toFixed(2)}</span>}
               {Myorder.canceled && Myorder.canceledBy === "rider" && Myorder.RiderPhone === user.phone && Myorder.paymentSettled === false && <span className="mx-2 text-red-500 border-b-2 border-red-500">You owe : ₹40</span>}
             </div>
             <br />
             {Myorder.paymentSettled === true && <img src="../../images/GreenTick.png" alt="green tick" className="h-8 w-8 absolute top-2 right-2" />}
             {!Myorder.canceled && Myorder.paymentSettled === false && <span className='ml-4 text-red-500 absolute bottom-0 left-0'>payment due</span>}
             <div className='absolute right-0 bottom-0 '>{Myorder.completed ? <span className='text-red-500 '>delivered</span> : Myorder.picked ? <span className='text-blue-500'> picked</span> : Myorder.canceled ? <span className='text-gray-700'>cancelled</span> : <span className='text-green-500'>accepted</span>}</div>
           </div>
         ))}
         <br />
         <br />
         <hr />
         {!paymentRequest && totalAmount < 0 && <button onClick={handlePaymentRequest} className='absolute right-0 bg-green-500 text-white m-2 rounded-sm px-1 bottom-2'>Request ₹{-1 * totalAmount}</button>}
         {paymentRequest && <button className='absolute right-0 text-green-700 m-2 bottom-2'> payment request sent</button>}
         {totalAmount > 0 && <button onClick={settlePayment} className='absolute right-0 bottom-2 bg-blue-700 text-white m-2 rounded-sm px-1'>Pay ₹{totalAmount}</button>}
         {alltimeearning && <h1 className='text-black font-semibold underline absolute left-0 bottom-2'>All time earnings : ₹{alltimeearning}</h1>}
       </div>
     )}
 
     {option === "active orders" && (
       <div className='grid grid-cols-1 lg:grid-cols-2 mt-10'>
         {Activeorders.length === 0 ? (
           <h1 className=''>No active orders found</h1>
         ) : (
           Activeorders.map((order) => (
             <OrderCard
               key={order._id}
               orders={order}
               handleStatusProp={(value) => handleStatus(value)}
             />
           ))
         )}
       </div>
     )}
 
     {option === "payment requests" && (
       <div className=''>
         {incompleteRequests.map((req) => (
           <div key={req._id} className='p-4 border rounded shadow h-fit relative m-2'>
             <div className='shadow-sm mb-10'>
               <div className='font-bold'>Name: {req.riderName}</div>
               <div>Phone: {req.riderPhone}</div>
               <div>Amount: ₹{req.amount}</div>
               <div>Created At: {new Date(req.createdAt).toLocaleString()}</div>
             </div>
             {!paymentDone && <button className='absolute bottom-1 right-1 p-1 rounded-lg bg-green-500 text-white'
 
                onClick={() => PaymentDone(req._id)}
             >
               Mark as Paid
             </button>}
             {paymentDone && <div className='absolute bottom-1 right-1 p-1 rounded-lg bg-gray-500 text-white'>Paid</div>}
           </div>
         ))}
       </div>
     )}
     </div>
     </div>
 
     {editbankform && <BankDetailsForm role="edit" />}
     {bankformstatus && <BankDetailsForm role="add" />}
  </div>
); 

}

export default Riderscreen
