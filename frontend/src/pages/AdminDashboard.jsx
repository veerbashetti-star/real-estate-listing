import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminDashboard(){
  const [props, setProps] = useState([])

  const fetch = async ()=>{
    try{
      const res = await api.get('/properties?status=pending')
      setProps(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{ fetch() },[])

  const approve = async (id, status='approved')=>{
    try{
      await api.put(`/properties/${id}/approve`, { status })
      fetch()
    }catch(err){ alert('Failed') }
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      <div className="mt-4 space-y-4">
        {props.map(p=> (
          <div key={p._id} className="p-3 bg-white border rounded">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.location} • ₹{p.price}</p>
              </div>
              <div className="space-x-2">
                <button onClick={()=>approve(p._id,'approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                <button onClick={()=>approve(p._id,'rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
