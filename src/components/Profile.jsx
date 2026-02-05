import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import Header from "./shared/Header";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      return toast.error("Username and email are required");
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (image) formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.put(
        `${API_URL}/user/profile`,
        formData,
        { withCredentials: true }
      );

      const updatedUser = {
        ...res.data.user,
        profilepic: res.data.user.profilepic?.startsWith("http")
          ? res.data.user.profilepic
          : `${API_URL}${res.data.user.profilepic}`
      };

      setUser(updatedUser);
      setPreview(updatedUser.profilepic);
      setForm({ ...form, password: "" });

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setForm({
      username: user.username || "",
      email: user.email || "",
      password: ""
    });

    const pic = user.profilepic?.startsWith("http")
      ? user.profilepic
      : `${API_URL}${user.profilepic}`;

    setPreview(pic);
  }, [user]);

  return (
    <>

      <main className="min-h-screen bg-gray-100 pt-28 flex justify-center px-4 pb-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Profile Settings
          </h2>

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group">
              <img
                src={preview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                Change
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2 rounded-md transition"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </>
  );
};

export default Profile;
