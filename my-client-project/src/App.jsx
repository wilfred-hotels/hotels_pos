import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AdminDashboard from './components/AdminDashboard'
import AddNewSale from './components/AddNewSale';
function App() {

  return (
    <>
      
      <div className="dashboard-container">
      <AdminDashboard />
      <AddNewSale />
    </div>
      
      
    </>
  )
}

export default App
