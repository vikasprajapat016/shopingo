import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa6";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { auth, googleProvider } from './lib/firebase'


const baseUrl = import.meta.env.VITE_API_URL

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, login, loading: authLoading } = useAuth();
  const navigate = useNavigate();



   const googleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)

            const idToken = await result.user.getIdToken();


            //backend call
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/google/auth`,
                {idToken},
                {withCredentials: true}
            );

            login(res.data.user)
            toast.success("Login successfully")

            navigate("/")
        }catch (error) {
  console.error("Google Auth Error:", error.code, error.message);
  toast.error(error.message);

        }
    }
  


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    // Validation
    if (!username || !email || !password)
      return toast.error("All fields are required!");
    if (!/\S+@\S+\.\S+/.test(email))
      return toast.error("Invalid email address");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.message || "Signup failed!");
      }

      toast.success(data.message || "Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center px-4">
      <div className="p-6 bg-white w-full max-w-md rounded-2xl shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Create Account
        </h1>

        {/* Social Signup */}
        <div className="flex gap-4 justify-center mb-6">
          <button
          onClick={() => googleAuth()}
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
            <FaGoogle /> Google
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
            <FaFacebook /> Facebook
          </button>
        </div>

        <p className="text-center text-gray-500 mb-4">or sign up with email</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
