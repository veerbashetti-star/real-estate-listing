import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div>
          <Link to="/" className="font-bold text-lg">RealEstate</Link>
        </div>
        <div className="space-x-4">
          <Link to="/buyer" className="hover:underline">Buyer</Link>
          <Link to="/seller" className="hover:underline">Seller</Link>
          <Link to="/agent" className="hover:underline">Agent</Link>
          <Link to="/admin" className="hover:underline">Admin</Link>
          {user ? (
            <button onClick={logout} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          ) : (
            <Link to="/login" className="ml-2 px-3 py-1 bg-blue-500 text-white rounded">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
