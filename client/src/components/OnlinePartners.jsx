import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react';
function OnlinePartners() { 
   
 const [users,setUsers] = useState([]);
 
 const getUsers = async()=>{
    try{
       const response =  (await axios.get("http://localhost:5000/api/users/getonlinepartners")).data;
       setUsers(response);
    }
    catch(error)
    {
        console.log(error.message);
    }
 }

 useEffect(()=>{
     getUsers()
 },[])
  
  return (
    <div className="relative ">
    <div className='absolute right-0 bg-gray-200 mt-5'>
      <div className=" p-4">
        <ul className="list-none p-0">
         {users.length===0 && <h1 className='text-red-500 mt-2'>No Riders Online</h1>}
          {users.map(user => (
            <li key={user.id} className="p-2 border-b border-gray-300">
               <span className="mr-2">{user.name}</span>
               <span className='h-3 w-3 rounded-full bg-green-500 inline-block'></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  )
}

export default OnlinePartners
