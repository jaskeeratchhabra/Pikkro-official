import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import OrderCard from '../components/OrderCard';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
function MyOrders() {
   
  const [orders,setOrders] =useState([]);
  const [loading,setLoading] = useState(false);
  const loggedIn = useSelector(state=>state.authReducer.status)
  const [message,setMessage] = useState(false);
  let username=useSelector(state=>state.authReducer.username);
  // const [status, handleStatus] = useState("");
   useEffect(()=>{
      console.log(loggedIn)
   },[loggedIn])
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
        setLoading(false);
        if(result.data.length===0){
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
    console.log(loggedIn)
}, []);
  return (
    <div>
      
      {loading && <Loading/>}
      { message  && <h1 className='text-center text-xl p-2'>{message}</h1>}
      {!username && Swal.fire("login to view your orders")};
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
