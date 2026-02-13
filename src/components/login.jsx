import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa6";
import { auth, googleProvider } from './lib/firebase'
import axios from "axios";
import { signInWithPopup } from "firebase/auth";


const baseUrl = import.meta.env.VITE_API_URL
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, loading, setLoading } = useAuth();
  const navigate = useNavigate();



  //google Auth

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) return toast.error("All fields are required!");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email address");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message || "Login failed!");

      login(data.user);
      toast.success(data.message || "Login successful!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center px-4">
      <div className="bg-white p-6 w-full max-w-md rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Social Login */}
        <div className="flex justify-center gap-4 mb-6">
          <button
          onClick={() => googleAuth()}
          className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
            <FaGoogle /> Google
          </button>
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
            <FaFacebook /> Facebook
          </button>
        </div>

        <p className="text-center text-gray-500 mb-4">or login with email</p>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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

          <p
            className="text-sm text-indigo-600 cursor-pointer text-right hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
