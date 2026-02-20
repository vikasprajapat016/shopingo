import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { useCart } from "./CartContext";
import { FaShare } from "react-icons/fa6";
const baseUrl = import.meta.env.VITE_API_URL; 

const Card = ({  product }) => {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const {addToCart, updateQuantity, loading, cart, loadingProductId} = useCart();

 const formattedPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(product.price);



  const isInCart = cart.some(
    item => item.productId === product?._id
  );


  if (!product) {
  return <p className="text-center mt-10">Loading product...</p>;
}


  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 "
>      
      {/* Image Section */}
      <div className="relative bg-gray-100 flex justify-center items-center h-40 md:h-52"
          onClick={() => navigate(`/product/${product._id}`)}
>
        <img
          src={`${baseUrl}/${product.thumbnail}`}
          alt={product.title}
          className="h-30 md:h-40 object-contain transition-transform duration-300 group-hover:scale-110 cursor-pointer"
          onError={(e) => {
            e.target.src =
              "https://cdn-icons-png.flaticon.com/512/679/679821.png";
          }}
        />

        {/* Rating */}
          {product.rating?
       ( <div className="absolute top-3 left-3 bg-green-600 text-white text-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <MdStar />
         {product.rating.toFixed(1) }
        </div>) : "" }

        {/* Wishlist */}
        <button
          onClick={(e) =>{
            e.stopPropagation();
            setWishlisted(!wishlisted)}}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
        >
          {wishlisted ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {product.title}
        </h2>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="mt-4 flex justify-between items-center">
          <span className=" text-lg md:text-xl font-bold text-indigo-600">
            {formattedPrice}
          </span>


            {/*add to cart */}

        <div className="flex gap-2">
  {loadingProductId === product._id ? (
    <p className="text-xs">Adding...</p>
  ) : isInCart ? (
    /* Quantity controls (NOT inside a button) */
    <div className="flex items-center border rounded-lg">
      <button 
      disabled={loading}
        onClick={(e) => {
       e.stopPropagation();

  const cartItem = cart.find(item => item.productId === product._id);

  if (!cartItem) return;

  if (cartItem.quantity < 1) {
    removeFromCart(product._id);
  } else {
    updateQuantity(product._id, cartItem.quantity - 1);
  }
}}

        className="px-3 py-1 text-lg cursor-pointer"
      >
        −
      </button>

      <span className="px-4">
          {cart.find(item => item.productId === product._id)?.quantity || 1}
      </span>

      <button
      disabled={loading}
                            onClick={(e) => {
  e.stopPropagation();

  const cartItem = cart.find(item => item.productId === product._id);

  if (!cartItem) return;

  updateQuantity(product._id, cartItem.quantity + 1);
}}

        className="px-3 py-1 text-lg cursor-pointer"
      >
        +
      </button>
    </div>
  ) : (
    /* Add to cart button */
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToCart(product, quantity);
      }}
      className="bg-indigo-600 p-2 rounded-lg text-white hover:bg-indigo-700 transition cursor-pointer"
      title="Add to Cart"
    >
      <FaShoppingCart />
    </button>
  )}
</div>



        </div>
      </div>
    </div>
  );
};

export default Card;
