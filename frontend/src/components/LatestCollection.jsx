import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const products = useSelector((state) => state.products.data || []);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const sortedByDate = [...products].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setLatestProducts(sortedByDate.slice(0, 10));
    }
  }, [products]);

  return (
    <section
      className="my-16 px-4 sm:px-6 lg:px-10"
      aria-label="Latest Product Collection Section"
    >
      <div className="text-center mb-8">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 mt-2">
          Step into a world of style with our newest collections — carefully curated to bring you the best in fashion, home decor, and more.
        </p>
      </div>

      {latestProducts.length > 0 ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 transition-all duration-500"
        >
          {latestProducts.map((item) => (
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 animate-pulse" role="status">
          Loading latest products...
        </div>
      )}
    </section>
  );
};

export default LatestCollection;
