/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker , DirectionsRenderer, LoadScript } from '@react-google-maps/api';

const MapContainer = ({ pickupAddress, deliveryAddress,status}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [pickupDirections, setPickupDirections] = useState(null);
  const [deliveryDirections, setDeliveryDirections] = useState(null);

  useEffect(() => {
    // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            console.log('Error: The Geolocation service failed.');
          }
        );
      } else {
        console.log("Error: Your browser doesn't support Geolocation.");
      }

      // Convert pickup address to coordinates
      if (pickupAddress) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: pickupAddress }, (results, status) => {
          if (status === 'OK') {
            setPickupLocation({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            console.log(`Geocode was not successful for the following reason: ${status}`);
          }
        });
      }

      // Convert delivery address to coordinates
      if (deliveryAddress) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: deliveryAddress }, (results, status) => {
          if (status === 'OK') {
            setDeliveryLocation({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            console.log(`Geocode was not successful for the following reason: ${status}`);
          }
        });
      }
  }, [pickupAddress, deliveryAddress]);

  useEffect(() => {
    if (currentLocation && pickupLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentLocation,
          destination: pickupLocation,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            setPickupDirections(result);
          } else {
            console.error(`Directions service failed with status: ${status}`);
          }
        }
      );
    }
  }, [currentLocation, pickupLocation]);

  useEffect(() => {
    if (pickupLocation && deliveryLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation,
          destination: deliveryLocation,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === 'OK') {
            setDeliveryDirections(result);
          } else {
            console.error(`Directions service failed with status: ${status}`);
          }
        }
      );
    }
  }, [pickupLocation, deliveryLocation]);


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

return (
    <div className=''>
      {/* <LoadScript googleMapsApiKey={map_key} libraries={libraries} onLoad={handleLoad}> */}
        <div className='my-5 flex justify-between'>
          {currentLocation && pickupLocation && (
            <div className='mr-2'>
             <p className='font-semibold'>Current to Pickup: <span className='text-blue-500'>{calculateDistance(currentLocation, pickupLocation)} km</span></p>
            </div>
          )}
          
          {pickupLocation && deliveryLocation && (
            <div className='ml-2'>
              <p className=' font-semibold'>Pickup to Delivery: <span className='text-blue-500'>{calculateDistance(pickupLocation, deliveryLocation)} km</span></p>
            </div>
          )}
        </div>
        {    status !=="new" &&
             <GoogleMap
               mapContainerStyle={{ width: '100%', height: '250px' }}
               center={currentLocation}
               zoom={12}
             >
             {/* Marker for user's current location */}
             {currentLocation && <Marker position={currentLocation} title="C" icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />}
   
             {/* Marker for pickup address */}
             {pickupLocation && <Marker position={pickupLocation} title="P" icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />}
   
             {/* Marker for delivery address */}
             {deliveryLocation && <Marker position={deliveryLocation} title="D" icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }} />}
   
             {/* Display directions from current location to pickup */}
             {pickupDirections && <DirectionsRenderer directions={pickupDirections} />}
   
             {/* Display directions from pickup to delivery */}
             {deliveryDirections && <DirectionsRenderer directions={deliveryDirections} />}

             </GoogleMap>
        }
      {/* </LoadScript> */}
    </div>
  );
};

export default MapContainer;
