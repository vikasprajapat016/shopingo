import React from "react";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { HiOutlineArrowUturnLeft } from "react-icons/hi2";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-800 pt-14 pb-6">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
         <div className=" flex justify-center items-center">
           <img className=" inline w-9 h-9 mr-1 "
          src="../images/sp2.svg"/>
           <h2 className="text-2xl font-bold">
             Shop<span className="text-purple-600">ingo</span>
          </h2>
         </div>
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            Shopingo is your trusted online shopping destination, offering
            quality products, secure payments, and fast delivery.
          </p>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col  items-center ">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link to="/" className="hover:text-indigo-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-600 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/product" className="hover:text-indigo-600 transition">
                Products
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-indigo-600 transition">
                My Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col  items-center ">
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <p className="text-gray-700 text-sm">
            Email:{" "}
            <span className="text-gray-600">shopingo1@gmail.com</span>
          </p>
          <p className="text-gray-700 text-sm mt-2">
            Phone:{" "}
            <span className="text-gray-600">+91 98765 43210</span>
          </p>

          <div className="flex gap-4 mt-5 text-xl">
            <FaInstagram className="cursor-pointer hover:text-pink-600 transition" />
            <FaFacebook className="cursor-pointer hover:text-blue-600 transition" />
            <FaYoutube className="cursor-pointer hover:text-red-600 transition" />
            <FaWhatsapp className="cursor-pointer hover:text-green-600 transition" />
          </div>
        </div>

        {/* Policies */}
        <div className="relative flex flex-col  items-center ">
          <h3 className="font-semibold text-lg mb-4">Our Promise</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <MdVerified size={22} className="text-green-600" />
              <span>100% Original Products</span>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineArrowUturnLeft size={22} className="text-indigo-600" />
              <span>14 Days Easy Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 mt-10"></div>

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <p>© 2026 Shopingo. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">
          Made with ❤️ for better shopping
        </p>
      </div>
    </footer>
  );
};

export default Footer;
