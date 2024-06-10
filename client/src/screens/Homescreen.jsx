/* eslint-disable no-undef */
import {useState} from 'react';
import { useRef ,useEffect} from 'react';
// import { LocationMarkerIcon } from "@heroicons/react/solid";'
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

import {
  // useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'

const Homescreen = () => {
  
   const originRef = useRef()
   const destiantionRef = useRef()   
   const [price, setPrice] = useState(null);
   const [distance,setDistance]=useState("");
   const [duration,setDuration]=useState("");
   const navigate= useNavigate();
   
   const user=JSON.parse(localStorage.getItem("user"))
   useEffect(()=>{
      
     if(distance){
       calculatePrice()
     }
   },[distance])
  
  function calculatePrice(){
    const distanceInKm = parseFloat(distance); 
    // console.log(typeof distanceInKm)
     if(distanceInKm<=3){
      setPrice(30)
     }
     if(distanceInKm>3){
      const cost = Math.round((30) + (distanceInKm-3)* (7));
      setPrice(cost);
     }
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    console.log(distance);
    console.log(duration);
  }


  return (
    <>
    {user && user.isRider && <button className='shadow-lg m-1 p-1' onClick={()=>(navigate("/rider"))}> Switch to rider mode</button>}
    {user && user.isAdmin && <button className='shadow-lg m-1 p-1' onClick={()=>(navigate("/admin"))}> Switch to admin screen</button>}
    <div className='grid md:grid-cols-2 grid-cols-1 mt-4'>

      <div className=" lg:mt-5 my-auto h-2/3 mx-auto md:order-2">
        <img className="h-full" src='../../images/Pikkro 3.jpg' alt="pikkro img"/>
      </div>

      <div className="lg:mt-5 lg:h-2/3 mx-auto bg-gray-100 px-6 rounded-sm shadow-lg md:order-1">
       <h1 className='mt-4 text-2xl mb-12 text-center font-bold'> Delivery starts from Rs 7/km</h1>
       <div className='flex'>
         <label>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" className="w-6 h-6">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
           </label>
           <Autocomplete className='w-auto'>
              <input
                type="text"
                ref={originRef}
                placeholder="Enter pickup location"
                className="md:min-w-96 w-fit mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
           </Autocomplete>
       </div>
         
       
       <div className='flex'>
         <label>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" className="w-6 h-6">
                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
           </label>
           <Autocomplete>
              <input
                type="text"
                ref={destiantionRef}
                placeholder="Enter delivery location"
                className=" md:min-w-96 w-fit mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
           </Autocomplete>
       </div>
         
         <div className='flex flex-col'>
           <button 
             onClick={calculateRoute} 
             className="ml-6 w-fit md:min-w-96 mb-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
           >
              Check Prices for Estimates
           </button>
           <span className='text-gray-600 text-center '>We treat your package as our most precious gift</span>
         </div>
   
   
   
         
         
         {price !== null && (
           <div className="mt-4">
             <span className='text-gray-800'>Estimated charges if parcel weight is less than 10 kg</span>
             <p className="text-lg font-semibold text-gray-900">: ₹{price} Your distance is {distance}</p>
              {/* <button className='bg-gray-500' onClick={setPrice(null)}>clear</button> */}
           </div>
         )}
         <div className='flex h-52 w-auto justify-between'>
           <div className='my-auto mx-auto mr-2'>
              <div className='flex flex-col text-blue-700 justify-center p-2 items-center font-semibold rounded-xl md:h-20 md:w-38 bg-white border border-blue-400'>
                Fastest Delivery
                <span className=' text-sm text-blue-300'>Delivery time 60 mins</span>
              </div>
           </div>
           <div className='my-auto mx-auto' >
              <div className='flex flex-col justify-center p-2 items-center text-blue-700 font-semibold rounded-xl md:h-20 md:w-38 bg-white border border-blue-400'>
                 Security Guarantee
                 <span className=' text-sm text-blue-300'>Most trusted Platform</span>
              </div>
           </div>
         </div>
      </div>
    </div>
      <div className='mb-32'>
        <div className='text-center mx-auto text-2xl font-semibold bg-gray-100 text-green-700'> We are delivering...</div>
        <div className='md:flex grid grid-cols-2'>
          <div className='text-center border border-gray-300 ml-1'>
            <img src='../../images/clothings.jpeg' alt='' className='h-50 w-50 '></img>
            <span className='font-semibold' >Clothings</span>
          </div>
          <div className='text-center border border-gray-300 ml-1'>
            <img src='../../images/documents.jpeg' alt='' className='h-50 w-50'></img>
            <span className='font-semibold'>Docs</span>
          </div>
          <div className='text-center border border-gray-300 ml-1'>
            <img src='../../images/food.jpeg' alt='' className='h-50 w-50'></img>
            <span className='font-semibold'>Food</span>
          </div>
          <div className='text-center border border-gray-300 ml-1'>
            <img src='../../images/gifts.jpeg' alt='' className='h-50 w-50'></img>
            <span className='font-semibold'>Gifts</span>
          </div>
          <div className='text-center border border-gray-300 ml-1'>
            <img src='../../images/grocery.jpeg' alt='' className='h-50 w-50'></img>
            <span className='font-semibold'>Grocery</span>
          </div>
          <div className='text-center border border-gray-300 ml-1'>
            <img src='../../images/medicines.jpeg' alt='' className='h-50 w-50'></img>
            <span className='font-semibold'>Medicine</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homescreen;
