import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import './App.css'
import Register from './components/Register'
import HomePage from './components/HomePage'
import Login from './components/Login'
import Cart from './components/Cart'
import Navbar from './components/Navbar'
import AdminDashboard from './components/AdminDeshboard'
import { AuthProvider } from './components/AuthContext'
import CreateProduct from './components/Admin/CreateProduct'
import ProductDetails from './components/ProductDetails'
// import ProductPage from './components/ProductPage'
import OrderPage from './components/OrderPage'
import PymentPage from './components/PymentPage'
import Profile from './components/Profile'
import MyOrders from './components/MyOrders'
import OrderControler from './components/Admin/OrderControler'
import UserList from './components/Admin/UserList'




function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div>
        <AuthProvider>
        <BrowserRouter>
          <div>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/admin' element={<AdminDashboard />} />
            
            {/* <Route path='/get' element={<ProductPage />} /> */}
            <Route path='/get/:id' element={<ProductDetails />} />
            <Route path='order/:id' element={<OrderPage />} />
            <Route path='pyment/:id' element={<PymentPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='myorders' element={<MyOrders />} />
            <Route path='admin/orders' element={<OrderControler /> } /> 
            <Route path='admin/users' element = {<UserList />} />
            <Route path='/admin/create' element={<CreateProduct />} />
           </Routes>
          </div>
        </BrowserRouter>

        </AuthProvider> 
      </div>
  )
}

export default App
