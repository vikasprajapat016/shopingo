import Login from './components/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Products from './components/Products'
import ProductDetails from './pages/ProductDetails'
import Profile from './components/Profile'
import SignUp from './components/SignUp'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Cart from './components/Cart'
import MyOrders from './pages/MyOrders'
import Offers from "./components/Offers"
import OfferProduct from './pages/OfferProducts'
import CategoryProducts from "./components/CategoryProducts"



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
