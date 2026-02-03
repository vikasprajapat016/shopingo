import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Card from "./Card";
import { fetchCategories } from "../api/category.js";
import { useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

  const { categoryId } = useParams();
  
  const API_URL = `${baseUrl}/admin/products/category/${categoryId}`;


  

   const featuredProducts = useMemo(() => {
      return products
        .filter(product =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
    }, [products, searchQuery]);
  

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(API_URL,
        {withCredentials: true}
      );
      setProducts(data.products);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  return (
    <>

      <main className="bg-gray-50 min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* PAGE TITLE */}
          <div className="text-center mb-10">
            <h1 className="inline-block px-6 py-2 rounded-md bg-gray-900 text-white text-2xl font-semibold">
              Products
            </h1>
          </div>


           {/* Search */}
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-96 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* ERROR STATE */}
          {error && (
            <p className="text-center text-red-600 mb-6">
              {error}
            </p>
          )}

{/* 
         <div className="flex  flex-wrap gap-3 mb-5">
           {category?.map(c => (
            <div
            key={c._id}
            className="border border-gray-500 p-2">{`${c.name}`  }</div>
          ))}
         </div> */}

          {/* LOADING STATE */}


            {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">


                       


 
                          {products.map(product => (
                          <div
                            key={product._id}
                            className="h-80 bg-gray-200 rounded-md animate-pulse"
                          />
                        ))}
                      </div>
                    ) : featuredProducts.length === 0 ? (
                      <p className="text-gray-600">No products found.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {featuredProducts.map(product => (
                          <Card
                            key={product._id}
                            product={product}
                          />
                        ))} 



                      </div>
                    )}

        </div>
      </main>

    </>
  );
};

export default Products;
