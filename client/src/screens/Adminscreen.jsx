import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from "../components/Loading";
import DeliveryPartnerCard from '../components/DeliveryPartnerCard';


const AdminScreen = () => {
  const [requestsType, setRequestsType] = useState('new');
  const [requests, setRequests] = useState([]);
  const [newRequest, setNew] =useState([]);
  const [approvedRequest,setApproved] = useState([]);
  const [disapprovedRequest, setDisapproved] = useState([]);
  const [loading, setLoading] = useState(true);
 
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
      const response = await axios.get(`/api/partners/getpartners`);
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
    <div className="container mx-auto p-4">
     {loading && <Loading/>}
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
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
      </div>
      <div className="gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          {/* <h2 className="text-xl font-semibold mb-4">{requestsType === 'new' ? 'New Requests' : requestsType === 'approved' ? 'Approved Requests' : 'Disapproved Requests'}</h2> */}
          {loading ? (
            <Loading />
          ) : (
            requestsType==="new" ?
            newRequest.map((deliveryPartner, index) => (
              <DeliveryPartnerCard className="grid sm:grid-cols-2" key={index} deliveryPartner={deliveryPartner} />
            ))
            :
             requestsType==="approved"?
            approvedRequest.map((deliveryPartner, index) => (
              <DeliveryPartnerCard className="grid sm:grid-cols-2" key={index} deliveryPartner={deliveryPartner} />
            ))
            :
            (
              disapprovedRequest.map((deliveryPartner, index) => (
              <DeliveryPartnerCard className="grid sm:grid-cols-2" key={index} deliveryPartner={deliveryPartner} />
            ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
