import Login from './components/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Products from './components/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Profile from './components/Profile.jsx'
import SignUp from './components/SignUp.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Cart from './components/Cart.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Offers from "./components/Offers.jsx"
import OfferProduct from './pages/OfferProducts.jsx'
import CategoryProducts from "./components/CategoryProducts.jsx"



function App() {
  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />

              <Route path='/product' element={<Products/>}/>
              <Route path='/product/category/:categoryId' element={<CategoryProducts />} />
              <Route path='/product/:id' element={<ProductDetails />} />
              <Route path='/about' element={<About />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/offers' element={<Offers/>}/>
              <Route path='/offers/:id'element={<OfferProduct/>}/>
              <Route path='/cart' element={<Cart/>}/>
              <Route path='orders' element={<MyOrders/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
