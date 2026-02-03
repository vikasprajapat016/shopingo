import React from "react";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { FaTruck, FaShieldAlt, FaTags, FaUsers } from "react-icons/fa";

function About() {
  return (
    <>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Shopingo
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Your trusted destination for quality products, unbeatable prices,
            and a seamless shopping experience.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <span className="font-semibold text-indigo-600">Shopingo</span>{" "}
              is a modern e-commerce platform built to make online shopping
              simple, secure, and enjoyable. From trending gadgets to daily
              essentials, we carefully curate products that offer real value.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to empower customers with quality products,
              transparent pricing, and fast delivery — all backed by excellent
              customer support.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Why Customers Love Us
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <FaTags className="text-indigo-600" />
                Best prices & exclusive deals
              </li>
              <li className="flex items-center gap-3">
                <FaTruck className="text-indigo-600" />
                Fast & reliable delivery
              </li>
              <li className="flex items-center gap-3">
                <FaShieldAlt className="text-indigo-600" />
                Secure payments & data protection
              </li>
              <li className="flex items-center gap-3">
                <FaUsers className="text-indigo-600" />
                Trusted by thousands of customers
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">10K+</h3>
            <p className="text-gray-600 mt-2">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">5K+</h3>
            <p className="text-gray-600 mt-2">Products Available</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">99%</h3>
            <p className="text-gray-600 mt-2">Positive Reviews</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-indigo-600">24/7</h3>
            <p className="text-gray-600 mt-2">Customer Support</p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a future where online shopping is effortless,
            trustworthy, and accessible to everyone. Shopingo is built with
            technology, transparency, and customer satisfaction at its core.
          </p>
        </div>
      </section>

    </>
  );
}

export default About;
