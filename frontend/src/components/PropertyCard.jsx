import React from 'react'
import { Link } from 'react-router-dom'

export default function PropertyCard({ prop }) {
  return (
    <div className="border rounded bg-white p-4">
      <div className="h-40 bg-gray-200 flex items-center justify-center">{prop.images && prop.images.length ? <img src={prop.images[0]} alt="" className="h-full object-cover" /> : <span>No Image</span>}</div>
      <h3 className="font-semibold mt-2">{prop.title}</h3>
      <p className="text-sm text-gray-600">{prop.location}</p>
      <p className="mt-1 font-bold">₹{prop.price}</p>
      <Link to={`/properties/${prop._id}`} className="mt-2 inline-block text-sm text-blue-600">View</Link>
    </div>
  )
}
