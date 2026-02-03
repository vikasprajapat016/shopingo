import React from 'react'
import Header from './shared/Header';
import Footer from './shared/Footer';
import { Outlet } from 'react-router-dom';

const layout = () => {
  return (
    <div>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default layout
