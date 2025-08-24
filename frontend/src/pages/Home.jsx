import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";

import { setProducts } from "../slices/productsSlice";

import banner1 from "../assets/banner3.png";
import banner2 from "../assets/banner2.jpg";
import banner4 from "../assets/banner4.jpg";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Full page loader
const FullPageLoader = () => (
  <div className="w-screen h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
  </div>
);

const banners = [
  {
    banner: banner1,
    title: "Moments of Elegance",
    subtitle: "Discover timeless pieces that turn every look into a love story.",
  },
  {
    banner: banner2,
    title: "Grace in Every Sparkle",
    subtitle: "Unveil your elegance with jewelry that speaks louder than words.",
  },
  {
    banner: banner4,
    title: "Elegance Redefined.",
    subtitle:
      "Discover exquisite rings & bracelets—where artistry meets individuality.",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  const handleExplore = ()=>{
     navigate("/collection")
  }

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const resp = await api.get("/products");
        dispatch(setProducts(resp.data.products));
      } catch (error) {
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [dispatch]);

  if (loading) return <FullPageLoader />;

  return (
    <div>
      <Hero />

     
      <section className="relative w-full bg-[#f9f5f1] py-14 px-4 sm:px-10 my-2">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Embrace Elegance. Define Your Style.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-xl mx-auto">
            Explore handcrafted jewelry and the latest in women’s & men’s fashion – all in one beautiful destination.
          </p>
          <button className="mt-2 px-6 py-3 bg-black text-white font-semibold text-sm sm:text-base hover:bg-gray-800 transition" onClick={handleExplore}>
            Explore Now
          </button>
        </div>
      </section>

      <LatestCollection />
      <BestSeller />

     
      <section className="py-14 bg-[#fdf9f4] px-4 sm:px-10">
        <h3 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Shop the Look
        </h3>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-10 max-w-xl mx-auto">
          Discover curated outfits and jewelry pairings that redefine elegance and everyday style.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              <img
                src={item.banner}
                alt={item.title}
                className="w-full h-[300px] sm:h-[380px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 backdrop-blur-sm">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-sm">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
};

export default Home;
