// import react from "@vitejs/plugin-react-swc"
import NavigationBar from "./components/Navbar"
import Homescreen from "./screens/Homescreen"
import { BrowserRouter,Route,Routes } from "react-router-dom"
import Orderscreen from "./screens/Orderscreen.jsx"
import LoginForm from "./screens/LoginForm.jsx"
import RegisterForm from "./screens/RegisterForm.jsx"
import DeliveryPartnerForm from "./screens/DeliveryPartnerForm.jsx"
import MyOrders from "./screens/MyOrders.jsx"
export default function App() {
  return (
    <>
    <BrowserRouter>
      <NavigationBar/>
      <Routes>
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