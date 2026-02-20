import React, { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { Currency } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const { user } = useAuth();

  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const baseUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  // ---------------- TOTAL ----------------
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ---------------- FETCH APPLICABLE OFFERS ----------------
  useEffect(() => {
    if (!cart.length) return;

    const fetchOffers = async () => {
      try {
        const categoryIds = cart.map(
          item => item.category?._id || item.category
        );

        const { data } = await axios.post(
          `${baseUrl}/user/applicable`,
          { categoryIds, cartTotal: totalPrice },
          { withCredentials: true }
        );

        setOffers(data.offers || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOffers();
  }, [cart, totalPrice]);

  // ---------------- ELIGIBLE SUBTOTAL ----------------
  const getEligibleSubtotal = (offer) => {
    return cart.reduce((sum, item) => {
      const categoryId = item.category?._id || item.category;
      if (offer.categories.includes(categoryId)) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
  };

  // ---------------- APPLY OFFER ----------------
  const applyOffer = () => {
    if (!selectedOffer) {
      return toast.error("Select an offer first");
    }

    const eligibleSubtotal = getEligibleSubtotal(selectedOffer);

    if (eligibleSubtotal === 0) {
      return toast.error("Offer not applicable to cart items");
    }

    let discountAmount = 0;

    if (selectedOffer.discountType === "percentage") {
      discountAmount =
        (eligibleSubtotal * selectedOffer.discountValue) / 100;
    } else {
      discountAmount = Math.min(
        selectedOffer.discountValue,
        eligibleSubtotal
      );
    }

    setAppliedOffer(selectedOffer);
    setDiscount(discountAmount);
  };

  const finalAmount = Math.max(0, totalPrice - discount);

  // ---------------- Cash On Delivery ----------------
  const handleCheckout = async () => {
    try {
      if (!user) return toast.error("Login to checkout");
const payload = {
  items: cart.map(item => ({
    product:
      typeof item.productId === "object"
        ? item.productId._id
        : item.productId,
    quantity: item.quantity,
  })),
  paymentMethod,
  offerId: appliedOffer?._id || null,
};
      if (paymentMethod === "COD") {
      await axios.post(`${baseUrl}/razor/create/cod-order`, payload, {
        withCredentials: true,
      });

      clearCart();
      toast.success("Order placed successfully");
      navigate("/orders")
      return;
    }

  //------------------- Online Payment -----------------


  if (!window.Razorpay) {
  toast.error("Razorpay SDK failed to load");
  return;
}

      
      const {data} = await axios.post(`${baseUrl}/razor/create/online/order`,
        payload,
        {withCredentials: true}
      );

   console.log("Razorpay Order:", data.razorOrder);
console.log("Amount (paise):", data.razorOrder.amount);




      const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 🔴 REQUIRED
  amount: data.razorOrder.amount,     // ✅ FIX
        currency: "INR",
        name: "Shopingo",
        description : "order Payment",
  order_id: data.razorOrder.id,       // ✅ FIX

     handler: async function (response) {
  await axios.post(`${baseUrl}/razor/verify/order`, {
   
  items: payload.items,
  offerId: payload.offerId,
  paymentMethod: "ONLINE",
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,


  }

,
        { withCredentials: true }
        );
      
      clearCart()
      toast.success("Payment Successful")
            navigate("/orders")

      },
      };
     
      console.log("Opening Razorpay with:", options);


      const rzp = new window.Razorpay(options)
      rzp.open();


    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };

  // ---------------- EMPTY CART ----------------
  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cart is empty
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-200 py-12">

        <h1 className="text-2xl mt-10 font-bold mb-6 text-center">
          Shopping Cart
        </h1>
      <div className="max-w-7xl mx-auto p-8 rounded-xl shadow">

      

      <div className="flex flex-col sm:flex-row gap-8  ">
          <div className="bg-white p-8 rounded-md md:min-w-3xl min-h-100">
           {/* ITEMS */}
        {cart.map(item => (
          <div
            key={item.productId}
            className=" gap-4 border-b py-4 flex flex-col md:flex-row md:justify-between "
          >
            <div className="flex gap-4 items-center"><img
              src={`${baseUrl}/${item.image}`}
              className="w-22 md:w-36 md:h-32 h-22 object-contain"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-xs md:text-xl text-gray-700">{item.title}</h2>
              <p className="mt-2 text-lg font-bold text-gray-700">₹{item.price.toFixed(2)}</p>
            </div>
 </div>
          <div className="flex md:flex-col md:justify-center justify-between items-center gap-10">
                 <div className="flex ml-2  items-center gap-4 text-xl font-semibold ">
              <button 
                disabled={loading}
                className="font-bold text-red-600 cursor-pointer"
                onClick={() =>
                  updateQuantity(
                    item.productId,
                    Math.max(1, item.quantity - 1)
                  )
                }
              >
                <FaMinus size={18}/>
              </button>
              <span>{item.quantity}</span>
              <button
              disabled={loading}
              className="cursor-pointer text-green-700 font-bold"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
              >
                <FaPlus size={22}/>
              </button>
            </div>

            <FaTrash
              className="text-red-600 cursor-pointer"
              onClick={() => removeFromCart(item.productId)}
            />
            </div>
          </div>
        ))}
        </div>

        {/* SUMMARY */}
        <div className=" font-semibold bg-white px-6 py-2 rounded-md  max-h-90">
          <div className="text-gray-700 pb-3 border-b w-full mb-6">Price Details </div>
          <p>Price ({cart.length} items):    ₹{totalPrice.toFixed(2)} </p>

          {offers.length > 0 && (
            <div className="mt-3">
              <select
                className="border-black border-1 p-2 rounded"
                value={selectedOffer?._id || ""}
                onChange={(e) =>
                  setSelectedOffer(
                    offers.find(o => o._id === e.target.value)
                  )
                }
              >
                <option value="">Select Offer</option>
                {offers.map(o => (
                  <option key={o._id} value={o._id}>
                    {o.title}
                  </option>
                ))}
              </select>

              <button
                onClick={applyOffer}
                className="ml-3 mt-3 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
              >
                Apply Offer
              </button>
            </div>
          )}

          {appliedOffer && (
            <p className="text-green-600 mt-2">
              Discount: -₹{discount.toFixed(2)}
            </p>
          )}

          <h2 className="text-lg font-bold mt-2">
            Total Amount : ₹{finalAmount.toFixed(2)}
          </h2>


          <select
  className="border-black border-1 p-2 rounded mt-4 mb-3"
  value={paymentMethod}
  onChange={(e) => setPaymentMethod(e.target.value)}
>
  <option value="COD">Cash On Delivery</option>
  <option value="ONLINE">Online</option>
</select>


         
        </div>

      </div>
        <div className="flex justify-between items-center mt-10 ">
           <button
            onClick={handleCheckout}
            className=" px-6 py-3 bg-indigo-600 text-white rounded cursor-pointer"
          >
            Checkout
          </button>
          <button 
          disabled={loading}
          onClick={() => clearCart()}
          className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer ">
              CLear Cart
          </button>
        </div>
      </div>
    </main>
  );
};

export default Cart;
