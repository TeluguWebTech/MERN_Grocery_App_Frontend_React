
import axios from 'axios'
import React, { useState } from 'react'
import { emailUrl } from '../repo/api_path'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const OtpVerify = () => {

  const userEmail = localStorage.getItem("userEmail")
    const [email, setEmail] = useState(userEmail)
    const [otp, setOtp] = useState("")

    const navigate = useNavigate()
    const {login} = useAuthStore.getState()

    const otpHandler = async(e)=>{
        e.preventDefault()
        const userName = localStorage.getItem("userName")
        try {
            const res = await axios.post(`${emailUrl}/verify-otp`,{
                email, otp
            })
            console.log(res.data)
            alert("verification successfull")
            login(userName, res.data.token)
            navigate("/")
        } catch (error) {
            alert("wrong otp")
        }
    }

  return (
    <div className='emailSection'>
        <div className="emailHeading verify">
            OTP Verification
        </div>
        <form onSubmit={otpHandler} className='emailForm'>
    
          <div className="" style={{color:"red"}}>
            OTP valid only for 5mins
          </div>
          
                <h3>Email</h3>
                <input type="email" defaultValue={email} />
         
          
                <h3>OTP</h3>
                <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} />
      
            <button type='submit'>Verify</button>
        </form>
    </div>
  )
}

export default OtpVerify