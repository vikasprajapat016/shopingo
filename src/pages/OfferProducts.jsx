import { fetchOfferProducts, fetchOffers } from "../api/offerApi";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../components/CartContext";
import Card from "@/components/Card";
import { FaShoppingCart } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_API_URL


const OfferProducts = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate();
  const {addToCart, updateQuantity, loading, cart, loadingProductId, removeFromCart} = useCart();

  useEffect(() => {
    fetchOfferProducts(id).then(res => {
      console.log(id)
      setOffer(res.data.offer);
      setProducts(res.data.products);
      console.log(products)
    });
  }, [id]);

  const isInCart = (id) => cart.some(
    item => item.productId === id
  );


  const discountPrice = (price) => {
   return  price - (price * offer.discountValue ) / 100
  }

  if (!offer) return null;

  return (
    <div className="px-4 md:px-10 py-6 mt-20">
      {/* Offer Banner */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        
        <img
          src={`${import.meta.env.VITE_API_URL}${offer.bannerImage}`}
          className="h-56 md:h-72 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              {offer.title}
            </h1>
            <p className="mt-2 text-lg font-semibold text-yellow-300">
              {offer.discountType === "percentage"
                ? `${offer.discountValue}% OFF`
                : `₹${offer.discountValue} OFF`}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(product => (
          
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="relative border rounded-xl p-3 hover:shadow-lg transition"
          >
             <div className="absolute top-2 left-2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-md">
          {offer.discountValue}% off
  </div>
            <img
              src={`${baseUrl}/${product.thumbnail}`}
              className="h-50 w-full object-cover rounded-lg cursor-pointer"
            />

            <h4 className="font-semibold mt-2 line-clamp-1">
              {product.title}
            </h4>

            {/*price add to cart div */}

            <div className="mt-1">
              <div className="flex justify-between items-center">
              
                <div>                  
                <span className="text-black font-semibold text-lg block"> ₹{discountPrice(product.price).toFixed(2)}</span>
                <span className="text-gray-500 text-xs font-semibold">M.R.P : </span><span className="text-gray-500  line-through text-xs">
                ₹{product.price.toFixed(0)}
              </span>
                  </div>  
            
                    {/*add to cart */}
              
                      <div className="flex gap-2">
                {loadingProductId === product._id ? (
                  <p className="text-xs">Adding...</p>
                ) : isInCart(product._id) ? (
                  /* Quantity controls (NOT inside a button) */
                  <div className="flex items-center border rounded-lg">
                    <button 
                    disabled={loading}
                     onClick={(e) => {
  e.stopPropagation();

  const cartItem = cart.find(item => item.productId === product._id);

  if (!cartItem) return;

  if (cartItem.quantity <= 1) {
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
                    className="bg-indigo-600 p-2 cursor-pointer rounded-lg text-white hover:bg-indigo-700 transition"
                    title="Add to Cart"
                  >
                    <FaShoppingCart />
                  </button>
                )}
              </div>
              
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default OfferProducts;