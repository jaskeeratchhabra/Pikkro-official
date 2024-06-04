// import react from "@vitejs/plugin-react-swc"
import NavigationBar from "./components/Navbar"
import Homescreen from "./screens/Homescreen"
import { BrowserRouter,Route,Routes } from "react-router-dom"
import Orderscreen from "./screens/Orderscreen.jsx"
import LoginForm from "./screens/LoginForm.jsx"
import RegisterForm from "./screens/RegisterForm.jsx"
import DeliveryPartnerForm from "./screens/DeliveryPartnerForm.jsx"
import MyOrders from "./screens/MyOrders.jsx"
import Adminscreen from "./screens/Adminscreen.jsx"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Riderscreen from "./screens/Riderscreen.jsx"
import Loading from "./components/Loading.jsx"
import Footer from "./components/Footer.jsx"
import { LoadScript } from "@react-google-maps/api"
import Terms from "./pages/Terms"
import ForgotPassword from "./screens/ForgotPassword.jsx"
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import CancellationPolicy from "./pages/CancellationPolicy.jsx"
import RiderTermsAndConditions from "./pages/RiderTermsAndConditions.jsx"


export default function App() {
  
  const user =useSelector(state=>state.authReducer.status);
  const [Admin,setAdmin]=useState(false);
  const [Rider,setRider]= useState(false);
  const [loading,setLoading] =useState(true);
  const [ libraries ] = useState(['places']);
  const map_key = import.meta.env.VITE_MAP_API_KEY;
  const handleLoad=()=>{
     setLoading(false);
  }
  useEffect(()=>{
    if(!user){
      setLoading(false);
    }
    if(user)
    {
       const boolAdmin= (JSON.parse(localStorage.getItem("user"))).isAdmin;
       setAdmin(boolAdmin);
       const boolRider = (JSON.parse(localStorage.getItem("user"))).isRider;
       setRider(boolRider)
       setLoading(false);
      }
      // console.log(Rider, "hello");
      // console.log((JSON.parse(localStorage.getItem("user"))).isRider);
      // console.log(localStorage.getItem("user"));
  },[user,Admin,Rider])

  return (
    <div>
    {loading && <Loading/>}
    <BrowserRouter>
      <NavigationBar/>
      <LoadScript googleMapsApiKey={map_key} libraries={libraries} onLoad={handleLoad}>
        <Routes>
          {Rider && <Route path ="/Rider" exact element ={<Riderscreen/>}/>}
          <Route path="/" exact element={<Homescreen/>}/>
        </Routes>
      </LoadScript>
      <Routes>
         {Admin && <Route path="/Admin" exact element={<Adminscreen/>}/>}
         <Route path= "/forgotPassword" exact element= {<ForgotPassword/>}/>
         <Route path="/T&c" exact element={<Terms/>}/>
         <Route path="/DeliveryPartnerForm" exact element ={<DeliveryPartnerForm/>}/>
         <Route path="/MyOrders" exact element={<MyOrders/>} />
         <Route path="/login" exact element={<LoginForm/>}/>
         <Route path="/create-order" exact element={<Orderscreen/>}/>
         <Route path="/register" exact element ={<RegisterForm/>}/>
         <Route path ="/PrivacyPolicy" exact element={<PrivacyPolicy/>}/>
         <Route path ="/cancellation" exact element={<CancellationPolicy/>}/>
         <Route path ="/RiderT&C" exact element={<RiderTermsAndConditions/>}/>
         
         {/* <Route path ="/edit-order" exact element ={<EditOrderScreen/>}/> */}
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>
  )
}