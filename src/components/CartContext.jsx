import { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "./AuthContext";



const baseUrl = import.meta.env.VITE_API_URL

const CartContext = createContext(null);
const API_URL = `${baseUrl}/cart`;

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);

  // Fetch cart on login
  useEffect(() => {
    if (!user) return setCart([]);
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${user._id}`);
        setCart(data.products || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, [user]);

  // Add product
  const addToCart = async (product, quantity = 1) => {
    if (!user) return toast.error("Login to add to cart");

    try {
      const payload = {
        product: {
          productId: product._id,
          title: product.title,
          price: product.price,
          
          image: product.thumbnail || "",
          quantity,
              category: product.category, // <--- add category here

        },
      };
      const { data } = await axios.post(`${API_URL}/add/${user._id}`, payload);
      setCart(data.products);
      toast.success("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };



// update cart 

const updateQuantity = async (productId, quantity) => {
  if (!user) return toast.error("Login required");

  
  try {
    
    const { data } = await axios.patch(
    `${API_URL}/quantity/${user._id}/${productId}`,
    { quantity },
    { withCredentials: true }
  );

  setCart(data.products);
  toast.success("Quantity updated")
  } catch (error) {
    toast("Failed to update quantity")
  }
};



  // Remove product
 const removeFromCart = async (productId) => {
  if (!user) return toast.error("Login to remove item");

  try {
    const { data } = await axios.delete(
      `${API_URL}/${user._id}/${productId}`,
      { withCredentials: true }
    );

    setCart(data.products || []);
    toast.success("Item removed 🗑️");
  } catch (err) {
    console.error(err);
    toast.error("Failed to remove item");
  }
};

const clearCart = async () => {
  if (!user?._id) {
    return toast.error("Cannot clear cart: User not logged in");
  }

  try {
    const { data } = await axios.delete(
      `${API_URL}/clear/${user._id}`,
      { withCredentials: true }
    );
    setCart(data.products || []);
    toast.success("Cart cleared 🧹");
  } catch (err) {
    console.error("Clear cart failed:", err);
    toast.error(err.response?.data?.message || "Failed to clear cart");
  }
};








  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
