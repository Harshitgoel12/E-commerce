import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products
        .filter((item) => item.category === category && item.subCategory === subCategory)
        .slice(0, 5);
      setRelated(filtered);
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24 px-4">
      <div className="text-center mb-10">
        <Title text1="RELATED" text2="PRODUCTS" />
      </div>

      {related.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
          {related.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating}
              reviewCount={item.reviewCount}
              tag={item.tag}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-sm italic">
          No related products found.
        </p>
      )}
    </div>
  );
};

export default RelatedProducts;
