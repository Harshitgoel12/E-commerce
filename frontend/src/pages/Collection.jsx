import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import api from "../api/axios";

const filterOptions = {
  mainCategory: ["Clothing", "Jewellery"],
  category: ["Necklace", "Ring", "Earrings", "Bracelet"],
  subCategory: ["Gold", "Silver", "Diamond"],
  material: ["Gold", "Silver", "Diamond"],
  occasion: ["Casual", "Party", "Wedding"],
};

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortType, setSortType] = useState("relevant");
  const [loading, setLoading] = useState(true);

  const [mainCategory, setMainCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [material, setMaterial] = useState([]);
  const [occasion, setOccasion] = useState([]);

 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
       const res = await api.get("/products");
        setProducts(res.data.products || []);
       
      } catch (error) {
       
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleFilter = (value, setter) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setMainCategory([]);
    setCategory([]);
    setSubCategory([]);
    setMaterial([]);
    setOccasion([]);
    setSearch("");
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const filterBy = (array, key) => {
      if (array.length > 0) {
        result = result.filter((item) => item[key] && array.includes(item[key]));
      }
    };

    filterBy(mainCategory, "mainCategory");
    filterBy(category, "category");
    filterBy(subCategory, "subCategory");
    filterBy(material, "material");
    filterBy(occasion, "occasion");

    if (sortType === "low-high") result.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, search, mainCategory, category, subCategory, material, occasion, sortType]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [search, mainCategory, category, subCategory, material, occasion]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const renderFilterSection = (title, items, selected, setter) => (
    <div className="mb-4">
      <p className="mb-2 font-semibold text-gray-800">{title}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => toggleFilter(item, setter)}
              className="accent-pink-600"
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row px-4 py-6 gap-6 bg-white min-h-screen">
      <Toaster position="top-right" />
      <aside className="w-full lg:w-64">
        <div className="flex items-center justify-between lg:block mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <button
            className="lg:hidden text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Hide" : "Show"}
          </button>
        </div>

        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-pink-500 focus:outline-none"
          />
          <div className="bg-white border p-4 rounded-xl shadow-sm space-y-4">
            {renderFilterSection("Main Category", filterOptions.mainCategory, mainCategory, setMainCategory)}
            {renderFilterSection("Category", filterOptions.category, category, setCategory)}
            {renderFilterSection("Type", filterOptions.subCategory, subCategory, setSubCategory)}
            {renderFilterSection("Material", filterOptions.material, material, setMaterial)}
            {renderFilterSection("Occasion", filterOptions.occasion, occasion, setOccasion)}
          </div>

          <button
            onClick={clearFilters}
            className="mt-5 w-full bg-pink-600 text-white py-2 rounded text-sm hover:bg-pink-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <Title text1="Shop" text2="Now" />
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 border border-gray-300 text-sm rounded focus:outline-none focus:ring-1 focus:ring-pink-500"
            aria-label="Sort products"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10 animate-pulse">Loading products...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    image={item.images?.[0] || item.image}
                    name={item.name}
                    price={item.price}
                    rating={item.averageRating || 0}
                    reviewCount={item.reviews?.length || 120}
                    tag={
                      item.tag ||
                      ((item.averageRating || 0) >= 4.5 ? "Best Seller" : "")
                    }
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No products found. Try adjusting filters.
                </p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Collection;
