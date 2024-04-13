import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PopupComponent = ({ message }) => {
  useEffect(() => {
    toast(message);
  }, [message]);

  return <ToastContainer />;
};

export default PopupComponent;
