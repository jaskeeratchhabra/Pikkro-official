import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "../components/Loading";
import DeliveryPartnerCard from '../components/DeliveryPartnerCard';
import {useNavigate} from "react-router-dom"
import OnlinePartners from '../components/OnlinePartners';
import RiderBankCard from '../components/RiderBankCard';
const AdminScreen = () => {
  const url= import.meta.env.VITE_BASE_URL
  const [requestsType, setRequestsType] = useState('new');
  const [requests, setRequests] = useState([]);
  const [newRequest, setNew] =useState([]);
  const [approvedRequest,setApproved] = useState([]);
  const [disapprovedRequest, setDisapproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ridersBank,setRidersbank] = useState([])

 
  const navigate= useNavigate();

  const [showonline,setShowonline] = useState(false);

  const getRidersBankDetails = async ()=>{
    try{
         const data = (await axios.get(url+"/api/bank/getbank")).data;
         setRidersbank(data);
    }
    catch(error)
    {
      console.log(error.message)
    }
  }

  useEffect(()=>{
    getRidersBankDetails();
  },[])

  const handleNavigate = ()=>{
    navigate("/rider");
  }
 
  const handleOnline=()=>{
     setShowonline((prev)=>(!prev));
  }

  useEffect(() => {
    // Clear the state arrays before updating them
    setNew([]);
    setApproved([]);
    setDisapproved([]);
  

    requests.forEach(request => {
      if (request.approved === true) {
        setApproved(prevState => ([...prevState, request]));
      } else if (request.disapproved === true) {
        setDisapproved(prevState => ([...prevState, request]));
      } else {
        setNew(prevState => ([...prevState, request]));
      }
    });
  }, [requests ,requests.approved, requests.disapproved]);
    

useEffect(()=>{
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url+`/api/partners/getpartners`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  }
  fetchRequests();

  },[])

  return (
    <div className="container mx-auto p-4 relative">
     {loading && <Loading/>}
      <div className='absolute top-1 left-1'>
        <button className='bg-white text-black p-1 rounded-md shadow-lg'  onClick={handleNavigate}>Switch to Rider Screen</button>
      </div>
      {showonline && <OnlinePartners/>}
      <div className='absolute top-1 right-16'>
        <button className='bg-white text-black p-1 rounded-md shadow-lg '  onClick={handleOnline}>Online Riders</button>
      </div>
      <h1 className="text-2xl font-semibold mb-4 mt-10">Admin Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={() => setRequestsType('new')}
          className={`mr-2 ${requestsType === 'new' ? ' border-b-4 border-blue-700 '  : 'text-blue-700 shadow-lg'} px-4 py-2 rounded-md`}
        >
          New Requests
        </button>
        <button
          onClick={() => setRequestsType('approved')}
          className={`mr-2 ${requestsType === 'approved' ? 'border-b-4 border-blue-700 ' : 'text-blue-700 shadow-lg'} px-4 py-2 rounded-md`}
        >
          Approved Requests
        </button>
        <button
          onClick={() => setRequestsType('disapproved')}
          className={`mr-2 ${requestsType === 'disapproved' ? 'border-b-4 border-blue-700 ' : 'text-blue-700 shadow-lg'} px-4 py-2 rounded-md`}
        >
          Disapproved Requests
        </button>
        <button
          onClick={() => setRequestsType('bank')}
          className={`mr-2 ${requestsType === 'bank' ? ' border-b-4 border-blue-700 '  : 'text-blue-700 shadow-lg'} px-4 py-2 rounded-md`}
        >
          Rider's Bank 
        </button>
      </div>
      <div className="gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* <h2 className="text-xl font-semibold mb-4">{requestsType === 'new' ? 'New Requests' : requestsType === 'approved' ? 'Approved Requests' : 'Disapproved Requests'}</h2> */}
          {loading ? (
            <Loading />
          ) : (
            requestsType==="new" ?
            newRequest.map((deliveryPartner, index) => (
              <DeliveryPartnerCard className="grid md:grid-cols-2" key={index} deliveryPartner={deliveryPartner} />
            ))
            :
             requestsType==="approved"?
            approvedRequest.map((deliveryPartner, index) => (
              <DeliveryPartnerCard className="grid md:grid-cols-2" key={index} deliveryPartner={deliveryPartner} />
            ))
            :
            ( requestsType==="disapproved" &&
              disapprovedRequest.map((deliveryPartner, index) => (
              <DeliveryPartnerCard className="grid md:grid-cols-2" key={index} deliveryPartner={deliveryPartner} />
            ))
            )
          )}

          {
            requestsType==="bank" && ridersBank.length>0 &&
             ridersBank.map((rider)=>(
              <RiderBankCard key={rider._id} rider ={rider}/>
             ))
          }
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
