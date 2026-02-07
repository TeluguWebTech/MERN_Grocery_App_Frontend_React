import axios from 'axios'
import React, { useState } from 'react'
import { emailUrl } from '../repo/api_path'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'


const SendOtp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const navigate = useNavigate()

    const emailHandler = async(e)=>{
        e.preventDefault()
        try {
            const res = axios.post(`${emailUrl}/send-otp`,{
                name, email
            })
            console.log(res.data)
            alert("OTP sent to ur email")
            localStorage.setItem("userEmail", email)
            localStorage.setItem('userName', name)
            setName("")
            setEmail("")
            navigate("/verify-otp")
        } catch (error) {
            alert("failed to send otp")
        }
    }

  return (
    <div className='emailSection'>
        <div className="emailHeading">
            *Please enter your Name and Email for OTP
        </div>
        <form onSubmit={emailHandler}
        className='emailForm'
        >
            <h3>Name</h3>
            <input type="text" 
            placeholder='please enter your Name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <h3>Email</h3>
            <input type="email" 
            placeholder='please enter your Name'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <button type='submit'>Send OTP</button>
        </form>
    </div>
  )
}

export default SendOtp