import React, { useEffect, useState } from 'react'
import api from '../services/api'
import PropertyCard from '../components/PropertyCard'

export default function Buyer(){
  const [properties,setProperties]=useState([])
  const [search,setSearch]=useState('')

  const fetch = async () =>{
    try{
      const res = await api.get('/properties')
      setProperties(res.data)
    }catch(err){
      console.error(err)
      alert('Failed to fetch properties')
    }
  }

  useEffect(()=>{ fetch() },[])

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold">Listings</h2>
      <div className="mt-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by city or title" className="p-2 border w-full max-w-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {properties.map(p=> <PropertyCard key={p._id} prop={p} />)}
      </div>
    </div>
  )
}
