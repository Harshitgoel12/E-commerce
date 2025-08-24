import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import jewellaryBanner from "../assets/jewllaryBanner.jpg";
import slide from "../assets/j.png";
import banner4 from "../assets/banner4.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate=useNavigate();
  const slides = [
    {
      image: slide,
      title: "Elegant Jewelry",
      subtitle: "Shine Bright This Season",
    },
    {
      image: banner4,
      title: "New Fashion Trends",
      subtitle: "Step Up Your Style",
    },
    {
      image: jewellaryBanner,
      title: "Luxury Collections",
      subtitle: "Make Every Day Glamorous",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    pauseOnHover: false,
  };



  const handleShop= ()=>{
navigate("/collection")
  }

  return (
    <section
      className="relative w-full h-[50vh] sm:h-[70vh] lg:h-[75vh] overflow-hidden"
      aria-label="Hero banner section"
    >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] bg-center bg-cover flex items-center justify-center transition-all duration-700"
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label={slide.title}
            >
              <div className="text-center text-white bg-black/40 backdrop-blur-sm p-6 sm:p-10 rounded-lg max-w-[90%] sm:max-w-xl">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-wide mb-4 prata-regular">
                  {slide.title}
                </h2>
                <p className="text-base sm:text-xl font-medium mb-6">
                  {slide.subtitle}
                </p>
                <button
                  className="px-6 py-3 text-sm sm:text-base bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors duration-200"
                  aria-label={`Shop now for ${slide.title}`}
                  onClick={handleShop}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
