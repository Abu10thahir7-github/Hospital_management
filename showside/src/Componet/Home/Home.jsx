import React from 'react'
import Home_img from './Homeimage2.jpg'
import  './Home.css'
import Employees from '../Employees/Employees'
function Home() {
  return (
    <div className='home'>
      <div class="image-con">
      <img  className='home-img' src={Home_img} alt="" />
  <div class="centered">
     <h1 >Medical Center </h1>
     <h1 style={{     border: 'solid 11px'}}>Health Haven  </h1>
    </div>
    
</div> 
<div className="employeAThome   p-3">

<Employees/>
</div>
    </div>
  )
}

export default Home
