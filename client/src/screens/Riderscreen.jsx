import {useState} from 'react'
import SuccessComponent from '../components/SuccessComponent'

const orderCard=({orders})=>{
  
  const [status,setStatus] = useState("");
  return (
    <>

    </>
  )
}
function Riderscreen() {
  const [option,selectOption] = useState("");

  const handleClick=(value)=>{
     selectOption(value)
  }

  return (
    <div>
        <div className='flex p-4'>
          <buttton
            onClick={()=>handleClick("new orders")}
            className={`${option==="new orders" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
           >New Orders</buttton>
          <buttton
            onClick ={()=>handleClick("earning per order")}
            className={`${option==="earning per order" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
          >Earning per order</buttton>
          <buttton
            onClick={()=>handleClick("all time earnings")}
            className={`${option==="all time earnings" ? "border-b-4 border-blue-700" : " text-blue-700 shadow-lg"} rounded-md mx-4 px-4 py-2`}
          >All time earnings</buttton>
        </div>
    </div>
  )
}

export default Riderscreen
