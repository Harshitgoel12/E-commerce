import { useState } from "react";
import { useDispatch } from "react-redux";
import { SignupData } from "../slices/userData";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import image from "../assets/image.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { Name, Email, Password, ConfirmPassword } = userData;

    if (!Name || !Email || !Password || !ConfirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Password !== ConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const resp = await api.post(
        "/send-otp",
        { Email }
      );

      if (resp.data?.success === false) {
        throw new Error(resp.data.message || "Failed to send OTP.");
      }

      toast.success("OTP sent successfully!");
      dispatch(SignupData(userData));
      navigate("/otp-verfication");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex flex-col md:flex-row h-screen w-full">
        {/* Left image section */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden">
          <img
            src={image}
            alt="Jewelry"
            className="w-full h-full object-cover brightness-75"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white"
          >
            <h2 className="text-4xl font-bold drop-shadow-lg">
              Elegance Begins Here
            </h2>
            <p className="mt-3 text-lg max-w-md drop-shadow-md">
              Create your account and start your journey with sparkle.
            </p>
          </motion.div>
        </div>

        {/* Right form section */}
        <div className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-[#fff9f4] to-[#fbe7e1] px-4 py-10">
          <form
            onSubmit={onSubmitHandler}
            className="w-full max-w-2xl md:w-4/5 lg:w-3/5 bg-white p-8 rounded-2xl shadow-lg space-y-4 text-gray-800"
          >
            <div className="text-center">
              <h2 className="text-3xl font-serif text-gray-900">Create Account</h2>
              <p className="text-sm text-gray-500 mt-1">
                Join us to discover elegance
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="Name"
                value={userData.Name}
                onChange={handleChange}
                required
                placeholder="e.g. Sarah Jewels"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="Email"
                value={userData.Email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="Password"
                value={userData.Password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="ConfirmPassword"
                value={userData.ConfirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div className="text-right text-sm">
              <Link to="/login" className="text-pink-500 hover:underline">
                Already have an account?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white bg-pink-600 hover:bg-pink-700 transition rounded-md font-semibold tracking-wide flex justify-center items-center"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
