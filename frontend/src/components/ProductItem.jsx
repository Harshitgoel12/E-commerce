import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductItem = ({
  id,
  image,
  name,
  price,
  rating = 0,
  reviewCount = 0,
  tag,
}) => {
  const productImage = Array.isArray(image) ? image[0] : image;

  const renderRating = () => {
    if (rating < 0) return null;

    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="flex items-center space-x-1 mt-3" role="img" aria-label={`Rated ${rating} out of 5`}>
        <div className="flex items-center space-x-[2px]">
          {[...Array(full)].map((_, i) => (
            <FaStar key={`full-${i}`} className="text-yellow-400 w-[18px] h-[18px]" />
          ))}
          {half && <FaStarHalfAlt className="text-yellow-400 w-[18px] h-[18px]" />}
          {[...Array(empty)].map((_, i) => (
            <FaRegStar key={`empty-${i}`} className="text-gray-300 w-[18px] h-[18px]" />
          ))}
        </div>
        <span className="text-sm text-gray-600 font-medium ml-1">
          ({rating.toFixed(1)}{reviewCount ? `, ${reviewCount}+` : ""})
        </span>
      </div>
    );
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group relative block rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 overflow-hidden"
    >
 
      {tag && (
        <span className="absolute top-3 left-3 z-10 bg-black/80 text-white text-[11px] px-3 py-1 rounded-full font-medium shadow-md">
          {tag}
        </span>
      )}

  
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      
      <div className="p-4 flex flex-col justify-between min-h-[160px]">
        <div>
          <h3 className="text-base font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-lg font-bold text-gray-900 mt-1">₹{price.toFixed(2)}</p>
          {renderRating()}
        </div>

        <button
          type="button"
          className="mt-4 w-full text-sm font-semibold text-white bg-black rounded-lg py-2 hover:bg-gray-800 transition duration-200"
        >
          View Details
        </button>
      </div>
    </Link>
  );
};

export default ProductItem;
