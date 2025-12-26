import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Buyer from './pages/Buyer'
import Seller from './pages/Seller'
import Agent from './pages/Agent'
import Login from './pages/Login'
import Register from './pages/Register'
import PropertyDetails from './pages/PropertyDetails'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/buyer" element={<ProtectedRoute><Buyer/></ProtectedRoute>} />
        <Route path="/seller" element={<ProtectedRoute roles={["seller","agent","admin"]}><Seller/></ProtectedRoute>} />
        <Route path="/agent" element={<ProtectedRoute roles={["agent"]}><Agent/></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/properties/:id" element={<PropertyDetails/>} />
      </Routes>
    </div>
  )
}
