// import React from 'react'
// import { useAuth } from './AuthContext'
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children}) => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     console.log('userData : ',userData);

//     if (!userData) return <Navigate to='/login' />;


//   return children
// }

// export default ProtectedRoute

// 


import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
<p className="animate-pulse text-xl font-bold">
  Verifying Session...
</p>
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

