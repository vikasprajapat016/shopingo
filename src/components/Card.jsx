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
  const {addToCart,} = useCart();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

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


  if (!product) {
  return <p className="text-center mt-10">Loading product...</p>;
}


  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
>      
      {/* Image Section */}
      <div className="relative bg-gray-100 flex justify-center items-center h-52"
          onClick={() => navigate(`/product/${product._id}`)}
>
        <img
          src={`${baseUrl}/${product.thumbnail}`}
          alt={product.title}
          className="h-40 object-contain transition-transform duration-300 group-hover:scale-110"
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
          onClick={() => setWishlisted(!wishlisted)}
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
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {product.title}
        </h2>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">
            {formattedPrice}
          </span>

          <div className="flex gap-2">
            <button
            title="Share "
            onClick={() => share(product)}
              className="text-sm px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              <FaShare/>
            </button>

            <button
              className="bg-indigo-600 p-2 rounded-lg text-white cursor-pointer hover:bg-indigo-700 transition"
              title="Add to Cart"
              onClick={() => addToCart(product) }
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
