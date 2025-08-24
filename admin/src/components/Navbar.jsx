
import { useSelector ,useDispatch } from "react-redux";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../slice/UserSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch= useDispatch();
const token =useSelector((state)=>state.singupData.userData);
  const handleLogout = () => {
    dispatch(UserData(null))
    localStorage.removeItem("User");
    navigate("/login");
  };

  return (
    <nav className=" top-0 left-0 z-50 w-full bg-[#fffdf8]/80 shadow-md backdrop-blur-md border-b border-[#f3e4c1]">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <Link to={"/"}>
          <img
            className="w-40 md:w-48 object-contain"
            src={assets.logo}
            alt="YukiLux Logo"
          />
        </Link>

        <div className="flex items-center gap-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#a77e4d] to-[#d1b78f] hover:opacity-90 shadow"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-medium text-[#7b5c47] border border-[#d9c8b1] rounded-full hover:bg-[#f2e7d7] transition"
              >
                Login
              </Link>
              
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
