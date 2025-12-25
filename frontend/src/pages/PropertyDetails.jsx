import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

export default function PropertyDetails(){
  const { id } = useParams()
  const [prop, setProp] = useState(null)

  useEffect(()=>{
    const fetch = async ()=>{
      try{
        const res = await api.get(`/properties/${id}`)
        setProp(res.data)
      }catch(err){
        alert('Failed to load')
      }
    }
    fetch()
  },[id])

  if(!prop) return <div className="container p-6">Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">{prop.title}</h2>
      <p className="text-gray-600">{prop.location} • ₹{prop.price}</p>
      <p className="mt-4">{prop.description}</p>
      <div className="mt-4">Owner: {prop.owner?.name} • {prop.owner?.phone}</div>
    </div>
  )
}
