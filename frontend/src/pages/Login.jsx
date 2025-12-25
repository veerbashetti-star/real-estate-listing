import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()

  const submit = async (e) =>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    }catch(err){
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold">Login</h2>
      <form onSubmit={submit} className="mt-4 max-w-sm">
        <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  )
}
