import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const products = useSelector((state) => state.products.data);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const topSellers = products
        .filter((item) => item.bestSeller === true)
        .slice(0, 5);
      setBestSeller(topSellers);
    }
  }, [products]);

  return (
    <section className="my-16 px-4 sm:px-6 md:px-10">
    
      <div className="text-center mb-10">
        <Title text1="BEST" text2="SELLERS" />
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-2">
          Discover what our customers love most! These top-selling items are must-haves —
          praised for their elegance, quality, and popularity.
        </p>
      </div>

    
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
        {bestSeller.length > 0 ? (
          bestSeller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.images?.[0] || item.image}
              name={item.name}
              price={item.price}
              rating={item.averageRating || 0}
              reviewCount={item.reviews?.length || 0}
              tag={
                item.tag ||
                ((item.averageRating || 0) >= 4.5 ? "Best Seller" : "")
              }
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No best sellers found.
          </p>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
