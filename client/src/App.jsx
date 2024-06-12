import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

import Homescreen from "./screens/Homescreen";
import Orderscreen from "./screens/Orderscreen";
import LoginForm from "./screens/LoginForm";
import RegisterForm from "./screens/RegisterForm";
import DeliveryPartnerForm from "./screens/DeliveryPartnerForm";
import MyOrders from "./screens/MyOrders";
import Adminscreen from "./screens/Adminscreen";
import Riderscreen from "./screens/Riderscreen";
import ForgotPassword from "./screens/ForgotPassword";

import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import RiderTermsAndConditions from "./pages/RiderTermsAndConditions";

export default function App() {
  const user = useSelector((state) => state.authReducer.status);
  const [Admin, setAdmin] = useState(false);
  const [Rider, setRider] = useState(false);
  const [loading, setLoading] = useState(true);
  const [libraries] = useState(['places']);
  const map_key = import.meta.env.VITE_MAP_API_KEY;

  const handleLoad = () => {
    setLoading(false);
  };
  const handleError = () => {
    console.error("Failed to load Google Maps API");
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
    }
    if (user) {
      const boolAdmin = JSON.parse(localStorage.getItem("user")).isAdmin;
      setAdmin(boolAdmin);
      const boolRider = JSON.parse(localStorage.getItem("user")).isRider;
      setRider(boolRider);
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="">
    <BrowserRouter>
      {loading && <Loading />}
      <NavigationBar />
      <LoadScript googleMapsApiKey={map_key} libraries={libraries} onLoad={handleLoad}
      onError={handleError}>
        <Routes>
          {Rider && <Route path="/Rider" element={<Riderscreen />} />}
          <Route path="/" element={<Homescreen />} />
          <Route path="/Admin" element={<Adminscreen />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/T&c" element={<Terms />} />
          <Route path="/DeliveryPartnerForm" element={<DeliveryPartnerForm />} />
          <Route path="/MyOrders" element={<MyOrders />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/create-order" element={<Orderscreen />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/cancellation" element={<CancellationPolicy />} />
          <Route path="/RiderT&C" element={<RiderTermsAndConditions />} />
        </Routes>
      </LoadScript>
      <Footer/>
    </BrowserRouter>
    </div>
  );
}
