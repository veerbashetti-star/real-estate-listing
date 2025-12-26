import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import PropertyCard from '../components/PropertyCard'

export default function Home(){
  const [properties,setProperties]=useState([])
 useEffect(()=>{
  const fetchProperties = async ()=>{
    try{
      const res = await api.get('/properties')
      setProperties(res.data.slice(0,6))
    }catch(err){
      console.error('Fetch properties failed', err)
    }
  }
  fetchProperties()
},[])


  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded p-6">
        <h1 className="text-3xl font-bold">Find your next home</h1>
        <p className="mt-2 text-gray-600">Browse verified properties or list your own.</p>
        <div className="mt-4 space-x-2">
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded">Register</Link>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Featured Listings</h2>
        {properties.length===0 ? (
          <p className="mt-2 text-gray-500">Login to see approved listings or go to Buyer page.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {properties.map(p=> <PropertyCard key={p._id} prop={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
