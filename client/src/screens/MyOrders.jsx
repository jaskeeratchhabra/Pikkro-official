import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import OrderCard from '../components/MyOrderCard';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function MyOrders() {
  const url= import.meta.env.BASE_URL
  const [orders,setOrders] =useState([]);
  const [loading,setLoading] = useState(false);
  const loggedIn = useSelector(state=>state.authReducer.status)
  const [message,setMessage] = useState(false);
  const navigate = useNavigate(); // Hook for programmatic navigation
  const user = localStorage.getItem("user");

  
    useEffect(() => {
      if (!user) {
        Swal.fire({
          title: 'Login to track your orders',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(-1); // Navigate back one step (equivalent to history.goBack())
          }
        });
      }
    }, [user, navigate]); 
    useEffect(()=>{
   
    async function getOrders(){
     if(!localStorage.getItem("user")){
         return ;
     }
     const userPhone = (JSON.parse(localStorage.getItem("user"))).phone
     try{
        setLoading(true);
        const result = (await axios.post(url+"/api/orders/myorder",{userPhone}));
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
    <div className='p-4'>
      
      {loading && <Loading/>}
      { message  && <h1 className='text-center text-xl p-2'>{message}</h1>}
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
