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
export default function App() {
  
  const user =useSelector(state=>state.status);
  const [Admin,setAdmin]=useState(false);
  const [Rider,setRider]= useState(false);
  const [loading,setLoading] =useState(true);

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
  },[user])

  return (
    <>
    {loading && <Loading/>}
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
         {Admin && <Route path="/Admin" exact element={<Adminscreen/>}/>}
         {Rider && <Route path ="/Rider" exact element ={<Riderscreen/>}/>}
         <Route path="/DeliveryPartnerForm" exact element ={<DeliveryPartnerForm/>}/>
         <Route path="/MyOrders" exact element={<MyOrders/>} />
         <Route path="/login" exact element={<LoginForm/>}/>
         <Route path="/" exact element={<Homescreen/>}/>
         <Route path="/create-order" exact element={<Orderscreen/>}/>
         <Route path="/register" exact element ={<RegisterForm/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}