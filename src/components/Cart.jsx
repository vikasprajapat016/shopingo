import React, { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const { user } = useAuth();

  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [discount, setDiscount] = useState(0);

  const baseUrl = import.meta.env.VITE_API_URL;

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

  // ---------------- CHECKOUT ----------------
  const handleCheckout = async () => {
    try {
      if (!user) return toast.error("Login to checkout");

      const payload = {
        items: cart.map(item => ({
          product: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image, // ✅ FIXED
          category: item.category,
        })),
        totalAmount: finalAmount,
        offerId: appliedOffer?._id || null,
      };

      await axios.post(`${baseUrl}/orders/create`, payload, {
        withCredentials: true,
      });

      clearCart();
      toast.success("Order placed successfully");
    } catch (err) {
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
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Shopping Cart
        </h1>

        {/* ITEMS */}
        {cart.map(item => (
          <div
            key={item.productId}
            className="flex gap-4 items-center border-b py-4"
          >
            <img
              src={`${baseUrl}/${item.image}`}
              className="w-32 h-32 object-contain"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{item.title}</h2>
              <p>${item.price}</p>
            </div>

          <div className="flex justify-between items-center gap-6">
                 <div className="flex items-center gap-4 text-xl font-semibold ">
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
                -
              </button>
              <span>{item.quantity}</span>
              <button
              disabled={loading}
              className="cursor-pointer text-green-700 font-bold"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <FaTrash
              className="text-red-600 cursor-pointer"
              onClick={() => removeFromCart(item.productId)}
            />
            </div>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="mt-6 font-semibold">
          <p>Total: ${totalPrice.toFixed(2)}</p>

          {offers.length > 0 && (
            <div className="mt-3">
              <select
                className="border p-2 rounded"
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
                className="ml-3 px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
              >
                Apply Offer
              </button>
            </div>
          )}

          {appliedOffer && (
            <p className="text-green-600 mt-2">
              Discount: -${discount.toFixed(2)}
            </p>
          )}

          <h2 className="text-xl font-bold mt-2">
            Amount To Pay : ${finalAmount.toFixed(2)}
          </h2>

         
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
