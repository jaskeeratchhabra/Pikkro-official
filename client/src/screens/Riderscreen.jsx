/* eslint-disable react/prop-types */
import {useState,useEffect} from 'react'
import SuccessComponent from '../components/SuccessComponent'
import axios from 'axios';
import Loading from "../components/Loading"
import MapContainer from '../components/MapContainer';
import PopupComponent from '../components/PopupComponent';
const OrderCard=({orders, handleStatusProp})=>{
  
  const [toggleP,settoggleP] = useState(false);
  const [toggleD,settoggleD] = useState(false);
  const [status,setStatus] = useState("new");
  const [loading,setLoading] = useState(false);
  const [RiderAccepted,setRider] = useState("");
  const [popup,setPopup] = useState(false);
  const riderName = (JSON.parse(localStorage.getItem("user"))).name
  const RiderPhone = (JSON.parse(localStorage.getItem("user"))).phone
  const paymentType = orders.paymentType;
  

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
  const handleStatus = async (value)=>{

    const userInfo = (JSON.parse(localStorage.getItem("user")));
    // console.log(userInfo)
    const _id = orders._id;
    const statusValue = { 
                          value: value,
                          RiderPhone: userInfo.phone,
                          RiderName: userInfo.name
                        }
    try{
    setLoading(true);
    const result = (await axios.patch(`/api/orders/${_id}`,statusValue)).data;
    // console.log(result)
    if(result.updatedDocument["accepted"]===true){
      setRider(result.updatedDocument.RiderPhone)
    }
    // console.log(result.updatedDocument)
    setStatus(prevStatus => {
      if (result.updatedDocument[value] === true) {
        return value;
      } else {
        return prevStatus; // Return the previous state if the update was not successful
      }
    });
     setLoading(false);
    }
    catch(error){
      console.log(error.message);
    }
    setLoading(false);
  }

  // function to hnadle pickup and delivery toggle button
  const handleToggle = (e) =>{
     if(e.target.name==="pickup"){
      settoggleP(!toggleP);
     }
     if(e.target.name==="drop"){
      settoggleD(!toggleD);
     }
  }
  


  return (
    <>
    <div className='w-3/4 mx-auto rounded-lg'>
    {loading  &&  <Loading/>}
      {popup && <PopupComponent className="absolute top-0" message={`Order ${status} by ${riderName}`}/>}
       <div className= "w-full shadow-xl p-2 m-2 border border-gray-300 relative"> 
          <div className='font-semibold text-xl text-gray-700 m-1'>
          {orders.Time && (
              <span>
                Pickup Time: {orders.Time.hours}:{orders.Time.minutes}{" "}
                <span>{orders.Time.meridian}</span>
              </span>
          )}
          </div>
          {
            status === "new" && <div>

             <div className='absolute right-2 mb-3 font-semibold'>Your earning: ₹{((0.8)* orders.price).toFixed(2)}</div>
             <div className='w-fit'>
              <div className='bg-black text-white rounded-md p-1 mb-3 animate-pulse'>New order</div> 
             </div>
              <MapContainer pickupAddress={orders.PickupDetails.address} deliveryAddress={orders.DeliveryDetails.address} status ={status} setDistanceToPickupProp={(distance)=>{handlePickupDistance(distance)}}/>
               <div className='mb-5 mt-5'>
                <ol className=''>
                  <b>Pickup: </b>
                  <li>
                      <ul>
                        <li>Address: {orders.PickupDetails.address}</li>
                        <li>Phone: {orders.PickupDetails.Phone.replace(/(\d{4})$/, 'XXXX')}</li>
                      </ul>
                      
                  </li>
                  <hr/>
                  <b>Delivery: </b>
                  <li>
                    <ul type="">
                      <li>Address: {orders.DeliveryDetails.address}</li>
                      <li>Phone: {orders.DeliveryDetails.Phone.replace(/(\d{4})$/, 'XXXX')}</li>
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
              <MapContainer pickupAddress={orders.PickupDetails.address} deliveryAddress={orders.DeliveryDetails.address} status ={status} setDistanceToPickupProp={(distance)=>{handlePickupDistance(distance)}}/>
             </div>
             <div className=" flex justify-between m-10 ">
               <div>
                   <button onClick={handleToggle} name = "pickup" className='rounded-md bg-black text-white p-1'>pickup Details</button>
                   {toggleP && <div className='flex flex-col border border-gray-200 mx-auto'>
                     <span><b>Address: </b> {orders.PickupDetails.address}</span>
                     <span><b>Phone:</b> {orders.PickupDetails.Phone}</span>
                     <span><b>Locality:</b> {orders.PickupDetails.Locality}</span>
                   </div>
                   }
               </div>
               <div className=''>
                
                   <button name="drop" onClick={handleToggle} className='rounded-md bg-black text-white text-center p-1'>Drop Details</button>
                   {
                     toggleD && <div className='flex flex-col border border-gray-200 mx-auto'>
                     <span><b>Address: </b>{orders.DeliveryDetails.address}</span>
                     <span><b>Phone:</b> {orders.DeliveryDetails.Phone}</span>
                     <span><b>Locality:</b> {orders.DeliveryDetails.Locality}</span>
                   </div>
                   }
               </div>
             </div>
               <div className='w-auto flex justify-center mb-10'> 
                   {paymentType==="cash" ? 
                   (<div className='p-1  border border-b-4 border-gray-500 w-fit rounded-md'>Collect cash:  ₹{orders.price}</div>)
                   :
                   (<div className='p-1 border border-b-4 border-gray-500 w-fit rounded-md'> Prepaid </div>)
                   }
               </div>
            </div>
           }
          <div className='flex'>
          
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
  const [settledArray,setSettledArray] = useState([""]);
  
  const handlePaymentStatus=(value)=>{
     setPaymentStatus(value);
  }
  const user= localStorage.getItem("user");
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
  const result = await axios.post("/api/payments/orders",{price: totalAmount});
  if(result)
    {
      handlePaymentStatus("paid")
    }
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

          const result = await axios.post("/api/payments/success", data);

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

  const handlePayment = async (orderId) => {
    console.log("OrderId:", orderId);
    try {
      const response = await axios.patch('/api/orders/updatepaymentfield', {
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
    if(paymentStatus==="paid"){
      for (const orderId of settledArray) {
        if (orderId) {
           handlePayment(orderId);
        }
      }
   }
  };
  
 
useEffect(() => {
  const handlePayments = () => {
    let amount = 0;
    const newSettledSet = new Set(settledArray); // Initialize with current settledArray

    Myorder.forEach((order) => {
      if (order.paymentSettled === false && order.canceled === false) {
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
    });

    setSettledArray(Array.from(newSettledSet)); // Convert set back to array
    setTotalAmount(amount);
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
  
 
  const handleClick=(value)=>{
     selectOption(value)
  }


  useEffect(()=>{
    
    async function getOrders(){
      try{
        setLoading(true)
        const result =  (await axios.get("/api/orders/getorder")).data;
        const newOrders= result.filter((order)=>(order.accepted===false ));
        const MyPickedOrders = result.filter((order)=>(order.RiderPhone === RiderContact && order.accepted===true))
        const ActiveOrders =   result.filter((order)=>(order.RiderPhone === RiderContact && order.accepted===true && order.completed===false))
        
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

  return (
    <div>
        {loading && <Loading/>}
         {option === "" && <div className=' text-center text-xl text-blue-500'>Select options to continue</div>} 
        <div className='flex'>
         <div className="w-1/6 p-2 bg-gray-100">
          {isAdmin && <button
            onClick={()=>handleClick("new orders")}
            className={`${option==="new orders" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
           >All Orders</button>
           }
            <button
            onClick={()=>handleClick("filtered orders")}
            className={`${option==="filtered orders" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
           >Orders near you</button>
          <button
            onClick={()=>handleClick("active orders")}
            className={`${option==="active orders" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
          >Active Orders</button>
          <button
            onClick ={()=>handleClick("earning per order")}
            className={`${option==="earning per order" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md m-4 py-2`}
          >Earning per order</button>
        </div>
        { 
          option==="filtered orders" && <div className='grid grid-cols-1 lg:grid-cols-2'>
            {
              orderInRange.map((order)=>(
                <OrderCard key={order._id} orders={order} handleStatusProp={(value)=>handleStatus(value)}/>
             ))
            }
         </div>
         }
         { 
           option==="new orders" && <div className='grid grid-cols-1 lg:grid-cols-2'>
             {
              neworders.map((order)=>(
                <OrderCard key={order._id} orders={order} handleStatusProp={(value)=>handleStatus(value)}/>
             ))
            }
         </div>

         }
         {
          option==="earning per order" && <div>
               {
                Myorder.map((Myorder)=>(
                  <div key={Myorder._id} className='w-full h-auto m-2 p-2 shadow-lg relative'>
                     <h1 className='mx-2 text-blue-500'>{Myorder.Date}</h1>
                     <hr/>
                     <div className='flex items-center my-1'>
                        <span className='text-Gray-600 font-semibold mx-2'>{Myorder.Item}:</span>
                        Earning on this order: ₹{(0.8 * Myorder.price).toFixed(2)}
                        {Myorder.paymentSettled=== false && Myorder.paymentType.split(' ')[0]==="cash" && <span className="mx-auto text-red-500 border-b-2 border-red-500 ">You owe : ₹{(Myorder.price * 0.2).toFixed(2)}</span>}
                        {Myorder.paymentType==="online" && <span className="mx-auto text-green-500 border-b-2 border-green-500">You get : ₹{(Myorder.price * 0.8).toFixed(2)}</span>}
                        {Myorder.paymentSettled===true && <img src="../../images/GreenTick.png" alt="green tick" className="h-10 w-10"/>}
                        {Myorder.Settled===false && <span className='ml-4 text-red-500'>payment due</span>}
                     </div>
                     <br/>
                     <div className='absolute right-0 bottom-0 '>{Myorder.completed ? <span className='text-red-500 '>delivered</span> : Myorder.picked ? <span className='text-blue-500'> picked</span>: Myorder.canceled ? <span className='text-gray-700'>cancelled</span> :<span className='text-green-500'>accepted</span>}</div>
                  </div>
                ))

               }
               <br/>
               <br/>
               <hr/>
              <div className='relative'>
               {totalAmount<0 && <button onClick={handlePaymentRequest} className='absolute right-0 bg-green-500 text-white m-2 rounded-sm px-1 bottom-2'>Request ₹{-1 * totalAmount}</button>}
               {totalAmount>0 && <button onClick={settlePayment} className='absolute right-0 bottom-2 bg-blue-700 text-white m-2 rounded-sm px-1'>Pay ₹{totalAmount}</button>}
              </div>
          </div>
         }
         {
          option==="active orders" && 
          <div className='grid grid-cols-1 lg:grid-cols-2'>
             {
              Activeorders.map((order)=>(
                <OrderCard key={order._id} orders={order} handleStatusProp={(value)=>handleStatus(value)}/>
             ))
            }
         </div>
         }
        </div>
    </div>
  )
}

export default Riderscreen
