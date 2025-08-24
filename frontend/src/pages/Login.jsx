import { useState } from "react";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import image from "../assets/image.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserData } from "../slices/userData";
import { toast } from "react-toastify";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError(""); 

    try {
     const response = await api.post("/login", loginData);

      const user = response.data.user;
      localStorage.setItem("Token",JSON.stringify(response.data.token));
      dispatch(UserData(user));
      localStorage.setItem("User", JSON.stringify(user));
      toast.success("Login Successfully",{
        position:"top-center"
      })
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password. Please try again.");
      toast.error("Login Failed")
    }
  };

  return (
    <>
      <NavBar />

      <div className="flex flex-col md:flex-row h-screen">
        <div className="hidden md:block md:w-1/2 h-full relative">
          <img
            src={image}
            alt="Jewelry Promo"
            className="w-full h-full object-cover brightness-75"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white"
          >
            <h2 className="text-4xl font-bold drop-shadow-lg">
              Shine with Elegance
            </h2>
            <p className="mt-3 text-lg max-w-md drop-shadow-md">
              Discover handpicked jewels and fashion curated just for you.
            </p>
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-[#fff4f0] to-[#fdeae4] p-6">
          <form
            onSubmit={onSubmitHandler}
            className="bg-white shadow-md rounded-xl w-full max-w-md px-8 py-6 flex flex-col gap-5"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-gray-900 prata-regular">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to continue your sparkle ✨
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="Email"
                value={loginData.Email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="Password"
                value={loginData.Password}
                onChange={handleChange}
                required
                placeholder="********"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <p className="cursor-pointer hover:underline">Forgot password?</p>
              <a href="/signup" className="text-pink-600 hover:underline font-medium">
                New here? Sign up
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
