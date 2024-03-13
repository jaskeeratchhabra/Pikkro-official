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

    useEffect(()=>{
   
    async function getOrders(){
    if(!localStorage.getItem("user")){
        return ;
    }
     const userPhone = (JSON.parse(localStorage.getItem("user"))).phone
     try{
        setLoading(true);
         const data = (await axios.post("/api/orders/myorder",userPhone)).data;
         if(data){
           setOrders(data);
         }
         setLoading(false);
     }
     catch(error){
        setLoading(false);
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
