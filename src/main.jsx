import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContext'
import { CartProvider } from './components/CartContext'

createRoot(document.getElementById('root')).render(
 <React.StrictMode>
   <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>,
 </React.StrictMode>
)
