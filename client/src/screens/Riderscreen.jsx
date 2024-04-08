/* eslint-disable react/prop-types */
import {useState,useEffect} from 'react'
import SuccessComponent from '../components/SuccessComponent'
import axios from 'axios';
import Loading from "../components/Loading"
import MapContainer from '../components/MapContainer';
const OrderCard=({orders , ordersInRange})=>{
  
  const [toggleP,settoggleP] = useState(false);
  const [toggleD,settoggleD] = useState(false);
  const [status,setStatus] = useState("new");
  const [loading,setLoading] = useState(false);
  const [distanceToPickup, setDistanceToPickup] = useState(0);

  const riderName = (JSON.parse(localStorage.getItem("user"))).name
  const paymentType = orders.paymentType;
  
  const handlePickupDistance = (distance)=>{
     setDistanceToPickup(distance);
  }

  useEffect(()=>{
    if(distanceToPickup){
      let distance = parseFloat(distanceToPickup);
  
      if(distance <= 7){
        console.log(orders.userPhone);
        ordersInRange(orders);
      }
    }

  },[distanceToPickup])

  // to update state of the order
  useEffect(()=>{  
      if(orders.completed=== true){
        setStatus("completed");
      }
      else if(orders.picked===true){
        setStatus("picked");
      }
      else if(orders.accepted===true){
        setStatus("accepted")
      }
  },[status])
  

  // function to handle status and to add rider details on state update
  const handleStatus = async (value)=>{

    const userInfo = (JSON.parse(localStorage.getItem("user")));
    console.log(userInfo)
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
    if(result.updatedDocument[value]===true){
      
       setStatus(value)
     }
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
    {loading  &&  <Loading/>}
    <div className='w-2/3 mx-auto rounded-lg'>
       <div className= "w-full shadow-xl p-4 m-4 border border-gray-300 relative"> 
          
          {status!=="new" && <SuccessComponent className="absolute top-0" message={`Order ${status} by ${riderName}`}/>}
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
          {status!=="new" && <div>
             <div className='absolute top-3 right-4 font-semibold'>order value:  ₹{orders.price}</div>
             <div>
              <MapContainer pickupAddress={orders.PickupDetails.address} deliveryAddress={orders.DeliveryDetails.address} status ={status} setDistanceToPickupProp={(distance)=>{handlePickupDistance(distance)}}/>
             </div>
             <div className=" flex justify-between m-10">
               <div>
                   <button onClick={handleToggle} name = "pickup" className='rounded-md bg-black text-white p-1'>pickup Details</button>
                   {toggleP && <div className='flex flex-col border border-gray-200 mx-auto'>
                     <span><b>Address: </b> {orders.PickupDetails.address}</span>
                     <span><b>Phone:</b> {orders.PickupDetails.Phone}</span>
                     <span><b>Locality:</b> {orders.PickupDetails.Locality}</span>
                   </div>
                   }
               </div>
               <div>
                
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
          
           {/* {status === "new" && <button onClick={()=>{handleStatus("accepted")}} className='rounded-md bg-green-500 text-white p-1 absolute right-5 bottom-5 '>Accept</button>} */}
           {status === "accepted" && <button onClick={()=>{handleStatus("picked")}} className='rounded-md bg-blue-500 text-white p-1 absolute right-5 bottom-5 '>Picked</button>}
           { status==="picked" && <button onClick={()=>{handleStatus("completed")}}className='rounded-md bg-red-500 text-white p-1 absolute right-5 bottom-5 '>Delivered</button> }
           { status==="completed"  && <h1 className=' text-red-700 p-1 absolute right-3 bottom-3 '> delivered</h1>}
          {/* <button className='rounded-sm bg-red-500 text-white mx-auto p-1'>Deny</button> */}
         </div>
       </div>
    </div>
    </>
  )
}


function Riderscreen() {
  const [option,selectOption] = useState("new orders");
  const [neworders, setNeworders] = useState([]);
  const [loading,setLoading] = useState(false);
  const [orderInRange,setOrderInRange] = useState([]);

  const handleOrderInRange = (order) => {
    // Check if the order already exists in the orderInRange array
    if (!orderInRange.some((existingOrder) => existingOrder._id === order._id)) {
      // console.log(order)
      setOrderInRange((prev) => [...prev, order]);
    }
  };
  
 
  const handleClick=(value)=>{
     selectOption(value)
  }

  useEffect(()=>{
    // console.log(orderInRange)
  },[orderInRange])

  useEffect(()=>{
    
    async function getOrders(){
      try{
        setLoading(true)
        const result =  (await axios.get("/api/orders/getorder")).data;

        const filteredOrders= result.filter((order)=>(order.accepted !== true ));
        setLoading(false);
        // console.log(result);
        setNeworders(filteredOrders);
      }
      catch(error){
       setLoading(false)
       console.log(error.message);
      }
    }
    getOrders();
  },[])
  return (
    <div>
        {loading && <Loading/>}
        <div className='p-4 flex'>
          <button
            onClick={()=>handleClick("new orders")}
            className={`${option==="new orders" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
           >New Orders</button>
            <button
            onClick={()=>handleClick("filtered orders")}
            className={`${option==="filtered orders" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
           >Orders near you</button>
          <button
            onClick ={()=>handleClick("earning per order")}
            className={`${option==="earning per order" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
          >Earning per order</button>
          <button
            onClick={()=>handleClick("all time earnings")}
            className={`${option==="all time earnings" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
          >All time earnings</button>
        </div>
        { 
          option==="filtered orders" && <div className='grid grid-cols-1 lg:grid-cols-2'>
            {
              orderInRange.map((order)=>(
                <OrderCard key={order._id} orders={order} ordersInRange= {handleOrderInRange}/>
             ))
            }
         </div>
         }
         { 
          option==="new orders" && <div className='grid grid-cols-1 lg:grid-cols-2'>
            {
              neworders.map((order)=>(
                <OrderCard key={order._id} orders={order} ordersInRange= {handleOrderInRange}/>
             ))
            }
         </div>
         }
    </div>
  )
}

export default Riderscreen
