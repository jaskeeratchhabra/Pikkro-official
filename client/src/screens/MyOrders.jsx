import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import OrderCard from '../components/OrderCard';

import { useSelector } from 'react-redux';
function MyOrders() {
   
  const [orders,setOrders] =useState([]);
  const [loading,setLoading] = useState(false);
  const loggedIn= useSelector((state)=>state.status);
  const [message,setMessage] = useState(false);
    useEffect(()=>{
   
    async function getOrders(){
    if(!localStorage.getItem("user")){
        return ;
    }
     const userPhone = (JSON.parse(localStorage.getItem("user"))).phone
     try{
        setLoading(true);
        const result = (await axios.post("/api/orders/myorder",{userPhone}));
        console.log(result.status)
        if(result.data.length===0){
          setLoading(false);
          setMessage("No orders found")
          return;
        }
         if(result){
           setOrders(result.data);
         }
     }
     catch(error){
        setLoading(false);
        console.log(error.message)
     }
    }
    getOrders();
  },[])

  useEffect(() => {
    console.log(orders);
}, [orders]);
  return (
    <div>
      
      {loading && <Loading/>}
      { message  && <h1 className='text-center text-xl p-2'>{message}</h1>}
      {!loggedIn && <h1>Login to view you orders</h1>}
      <div>
        {
            orders && orders.map((order)=>(
                <OrderCard key={order._id} order ={order} />
            ))
        }
      </div>
    </div>
  )
}

export default MyOrders
