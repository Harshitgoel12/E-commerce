import  { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import {useDispatch} from "react-redux"
import { UserData } from "../slice/UserSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
   const API_URL=import.meta.env.VITE_API_URL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch= useDispatch();
  const navigate=useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
          `${API_URL}/admin/login`, 
        { email, password },{
          withCredentials:true
        }
      );

      if (response.data.success) {
        localStorage.setItem("User",JSON.stringify(response.data));
    dispatch(UserData(response.data))
        toast.success("Login successful.");
        navigate("/")
       
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(
        error.response?.data?.message || "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  h-screen  overflow-y-hidden items-center justify-center  bg-gradient-to-br from-[#f7f3ef] to-[#fff] px-4">
      <div className="w-full mb-40 max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[#f0e0d6]">
        <div className="flex justify-center mb-6">
          <img src={assets.logo} alt="Trendify" className="w-40" />
        </div>
        <h2 className="text-xl font-semibold text-center text-[#5a3e2b] mb-6">
          Admin Login
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-[#9c6b30] hover:bg-[#805323] transition rounded-lg shadow-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
