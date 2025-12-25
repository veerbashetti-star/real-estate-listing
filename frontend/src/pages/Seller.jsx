import React, { useState } from 'react'
import api from '../services/api'

export default function Seller(){
  const [title,setTitle]=useState('')
  const [price,setPrice]=useState('')
  const [location,setLocation]=useState('')
  const [area,setArea]=useState('')
  const [propertyType,setPropertyType]=useState('Flat')
  const [description,setDescription]=useState('')

  const submit = async (e) =>{
    e.preventDefault()
    try{
      await api.post('/properties', { title, price, location, area, propertyType, description })
      alert('Property submitted for approval')
      setTitle(''); setPrice(''); setLocation(''); setArea(''); setDescription('')
    }catch(err){
      console.error(err)
      alert(err.response?.data?.message || 'Failed')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold">List Property</h2>
      <form onSubmit={submit} className="mt-4 max-w-lg space-y-2">
        <input className="w-full p-2 border" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Area (sqft)" value={area} onChange={e=>setArea(e.target.value)} />
        <select className="w-full p-2 border" value={propertyType} onChange={e=>setPropertyType(e.target.value)}>
          <option>Flat</option>
          <option>House</option>
          <option>Land</option>
          <option>Commercial</option>
        </select>
        <textarea className="w-full p-2 border" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
      </form>
    </div>
  )
}
