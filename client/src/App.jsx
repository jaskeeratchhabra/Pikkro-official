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
export default function App() {
  
  const user =useSelector(state=>state.status);
  const [Admin,setAdmin]=useState(false);
  useEffect(()=>{
    if(user)
    {
       const boolAdmin= (JSON.parse(localStorage.getItem("user"))).isAdmin;
       setAdmin(boolAdmin);
    }
  },[user])
  return (
    <>
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
         {Admin && <Route path="/Admin" exact element={<Adminscreen/>}/>}
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