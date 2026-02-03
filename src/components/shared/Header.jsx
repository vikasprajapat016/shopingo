import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";
import { useAuth } from "../AuthContext";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../CartContext";

const baseUrl = import.meta.env.VITE_API_URL


const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {cart } = useCart();

const cartCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
);
  const profileImage =
    user?.profilepic?.startsWith("http")
      ? user.profilepic
      : user?.profilepic
      ? `${baseUrl}${user.profilepic}`
      : "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  return (
    <header className="fixed top-0 z-50 w-full bg-white border-b shadow-sm ">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-wide ">
         <div className="flex justify-center items-center">
           <img className=" inline w-9 h-9 "
          src="/images/sp2.svg"/> <div className="inline px-1">Shop<span className="text-indigo-600">ingo</span></div>
          
         </div>
        </Link>

        {/* DESKTOP NAV */}
        {user && (
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
            
         

            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>
            <Link to="/product" className="hover:text-indigo-600">
              Products
            </Link>
            <Link to="/about" className="hover:text-indigo-600">
              About
            </Link>

             <Link to="/offers" className="hover:text-indigo-600">
              Offers
            </Link>

        
            <Link to="/orders" className="hover:text-indigo-600">
              Orders
            </Link>

            {/* CART */}
<Link to="/cart" className="relative hover:text-indigo-600">
  <FaShoppingCart className="text-xl" />

  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
      {cartCount}
    </span>
  )}
</Link>


            {/* PROFILE DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-9 h-9 rounded-full cursor-pointer border"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-white shadow-md rounded-md"
              >
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer"
                >
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        {/* MOBILE MENU ICON */}
        {user && (
          <button
            className="md:hidden cursor-pointer text-3xl text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <TiThMenu />
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && user && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/product" onClick={() => setMobileOpen(false)}>
              Products
            </Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)}>
              Profile
            </Link>
            <Link to="/offers" onClick={() => setMobileOpen(false)}>
              Offers
            </Link>
            <Link to='/cart' onClick={() => setMobileOpen(false)}>
             Cart ({cartCount})
            </Link>
              <Link to="/orders"  onClick={() => setMobileOpen(false)}>
              Orders
            </Link>

            <button
              onClick={logout}
              className="text-left text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
