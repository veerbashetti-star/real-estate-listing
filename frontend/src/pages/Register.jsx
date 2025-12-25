import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('buyer')
  const navigate = useNavigate()

  const submit = async (e) =>{
    e.preventDefault()
    try{
      const res = await api.post('/auth/register', { name, email, password, role })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    }catch(err){
      alert(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold">Register</h2>
      <form onSubmit={submit} className="mt-4 max-w-sm">
        <input className="w-full p-2 border mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="w-full p-2 border mb-2" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="agent">Agent</option>
        </select>
        <button className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
      </form>
    </div>
  )
}
