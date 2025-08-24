import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { assets } from '../assets/assets';
import { UserData } from '../slices/userData';
import { toast } from 'react-toastify';
import api from '../api/axios';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.singupData.userData);
  const isLoggedIn = Boolean(user);

 
  const handleLogout = async () => {
    setLoading(true);

    try {
      localStorage.removeItem("User");
      dispatch(UserData(null));
      await api.post(
  "/logout",
  {},
 
);

      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navItems = ['Home', 'Collection', 'About', 'Contact'];

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link to="/" className="flex flex-col leading-tight group">
          <span className="text-2xl font-serif font-semibold text-gray-900 transition group-hover:text-pink-600">
            <span className="text-pink-600">Yuki</span>Lux
          </span>
          <span className="text-xs tracking-wide text-gray-500 italic">
            FIND WHAT MOVES YOU
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <NavLink
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className={({ isActive }) =>
                `pb-1 transition-all ${
                  isActive
                    ? 'text-pink-600 font-semibold border-b-2 border-pink-600'
                    : 'hover:text-pink-600 hover:border-b hover:border-pink-400'
                }`
              }
            >
              {item.toUpperCase()}
            </NavLink>
          ))}

          {isLoggedIn && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `pb-1 transition-all ${
                  isActive
                    ? 'text-pink-600 font-semibold border-b-2 border-pink-600'
                    : 'hover:text-pink-600'
                }`
              }
            >
              MY ORDERS
            </NavLink>
          )}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hover:opacity-80 transition" aria-label="Search">
            <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
          </button>

          <Link to="/cart" className="relative hover:opacity-80 transition" aria-label="Cart">
            <img src={assets.cart_icon} alt="Cart" className="w-5 h-5" />
            
          </Link>

          {/* Login / Logout */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="hidden md:inline-block px-4 py-1.5 text-sm bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
            >
              Login
            </Link>
          ) : (
            <button
  onClick={handleLogout}
  disabled={loading}
  className={`hidden md:inline-block px-4 py-1.5 text-sm border rounded-full transition ${
    loading
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
  }`}
>
  {loading ? "Logging out..." : "Logout"}
</button>

          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `py-1 transition-all ${
                    isActive ? 'text-pink-600 font-semibold' : 'hover:text-pink-600'
                  }`
                }
              >
                {item}
              </NavLink>
            ))}

            {isLoggedIn && (
              <NavLink
                to="/orders"
                onClick={() => setMenuOpen(false)}
                className="py-1 hover:text-pink-600"
              >
                My Orders
              </NavLink>
            )}

            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="py-1 hover:text-pink-600"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-left py-1 hover:text-pink-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
