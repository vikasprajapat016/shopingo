import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdStar } from "react-icons/md";
import { FaShoppingCart, FaBolt, FaShare } from "react-icons/fa";
import { useCart } from "@/components/CartContext";
const Products = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const {addToCart,loading, cart, loadingProductId, updateQuantity} = useCart();
  const { id } = useParams();
  const navigate = useNavigate();



  const baseUrl = import.meta.env.VITE_API_URL ;

  const isInCart = cart.some(
    item => item.productId === product?._id
  );
  console.log(isInCart)

  const getProducts = async () => {
    try {
      setLoadingProduct(true);
      const res = await axios.get(
        `${baseUrl}/products/${id}`,
        {withCredentials: true}
      );
      setProduct(res.data.product);
      setSelectedImage(`${baseUrl}/${res.data.product.thumbnail || res.data.product.images?.[0]}`);
      setLoadingProduct(false);
    } catch (error) {
      console.error(error);
      setLoadingProduct(false);
    }
  };


   const share = (product) => {
    const url = `${window.location.origin}/product/${product._id}`;

    if (navigator.share) {
    navigator.share({
  title: product.title,
  text: "Check out this item",
  url,
}).catch(err => {
  console.log("Share cancelled", err);
});

    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied")
    }
  }

  useEffect(() => {
    getProducts();
  }, [id]);

  

  if (loadingProduct) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
          Loading product details...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-gray-100 px-4 py-12 mt-20">
        <h1 className="text-3xl font-bold text-center mb-10 "> {product.title}</h1>
        <div className="  max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 grid md:grid-cols-2 gap-10">
          

          {/* Images */}
          <div className="relative">
            <div className="bg-gray-100 rounded-xl flex justify-center items-center h-80">
              <img
                src={selectedImage}
                alt={product.title}
                className="h-64 object-contain"
              />
            </div>

            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={`${baseUrl}/${img}`}
                  alt="preview"
                  onClick={() => setSelectedImage(`${baseUrl}/${img}`)}
                  className={`h-20 w-20 object-contain rounded-lg cursor-pointer border 
                  ${
                    selectedImage === img
                      ? "border-indigo-600"
                      : "border-gray-300"
                  }`}
                />
              ))}


              <button
                          title="Share "
                          onClick={() => share(product)}
                            className="absolute top-3 right-2 text-sm px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
                          >
                            <FaShare/>
                          </button>
              
            </div>
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              {product.category.name}
            </span>

           

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-lg text-sm">
                <MdStar />
                {product.rating}
              </div>
              <span className="text-gray-500 text-sm">
                ({product.stock} in stock)
              </span>
            </div>

            <p className="text-gray-600 mt-5 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-6">
              <span className="text-3xl font-bold text-indigo-600">
                ${product.price.toFixed(0)}
              </span>
              <span className="ml-3 text-sm text-gray-500">
                Inclusive of all taxes
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-6">
              <span className="text-gray-700 font-medium">
                Quantity:
              </span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={(e) =>{
                  e.stopPropagation();
                    quantity > 1 && setQuantity(quantity - 1)
                    updateQuantity(product._id, quantity)

                  }}
                  className="px-3 py-1 text-lg"
                >
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => {setQuantity(quantity + 1)
                    updateQuantity(product._id, quantity)
                  }}
                  className="px-3 py-1 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
              disabled={loadingProductId === product._id} 
              onClick={() => {if (isInCart) {
                navigate("/cart") 
              } else {
                addToCart(product, quantity)}}
              }
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition flex items-center gap-2">
              
              {loadingProductId === product._id ?
                ("Adding to Cart...")
                : isInCart ? (
                  <>
                  <FaShoppingCart/>
                  Go to Cart
                  </>
                )
                : (
                  <>
                  <FaShoppingCart/>
                  Add to Cart
                  </>
                )
              }
              </button>

              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition">
                <FaBolt />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Products;
