import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [mainCategory, setMainCategory] = useState("Jewellery");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState("");

  const [loading, setLoading] = useState(false);

  const productSchema = {
    Jewellery: {
      categories: {
        Necklace: ["Gold", "Diamond", "Kundan"],
        Earrings: ["Gold", "Silver"],
        Ring: ["Gold", "Diamond"],
      },
      sizes: ["Free Size", "Adjustable"],
    },
    Clothing: {
      categories: {
        Topwear: ["T-Shirts", "Shirts", "Blouses"],
        Bottomwear: ["Jeans", "Trousers", "Skirts"],
        Dresses: ["Ethnic", "Western"],
      },
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
  };

  const dynamicCategories = productSchema[mainCategory]?.categories || {};
  const dynamicSubCategories = dynamicCategories[category] || [];
  const dynamicSizes = productSchema[mainCategory]?.sizes || [];

  const isFormValid = name && price && mainCategory && category && subCategory && image1;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1) {
      toast.error("At least one product image is required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      [image1, image2, image3, image4].forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      formData.append("mainCategory", mainCategory);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);
      formData.append("brand", brand);
      formData.append("material", material);
      formData.append("color", color);
      formData.append("deliveryCharge", deliveryCharge);
      formData.append("estimatedDeliveryDays", estimatedDeliveryDays);

      const response = await axios.post(`http://localhost:4000/api/v1/product`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setImage4(null);
    setMainCategory("Jewellery");
    setCategory("");
    setSubCategory("");
    setName("");
    setDescription("");
    setPrice("");
    setSizes([]);
    setBestSeller(false);
    setBrand("");
    setMaterial("");
    setColor("");
    setDeliveryCharge("");
    setEstimatedDeliveryDays("");
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg border border-[#f5e4c3]"
    >
      <h2 className="text-2xl font-bold text-[#6b4c3b] mb-2">Add New Product</h2>
      <p className="text-sm text-red-500 mb-4">* Required Fields</p>

      {/* Image Upload Section */}
      <div>
        <p className="text-base font-semibold text-[#6b4c3b] mb-2">
          Upload Product Images<span className="text-red-500 ml-1">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[image1, image2, image3, image4].map((img, i) => {
            const id = `image${i + 1}`;
            const setImage = [setImage1, setImage2, setImage3, setImage4][i];
            return (
              <label key={id} htmlFor={id} className="cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg border-2 border-dashed border-[#d6b98c] flex items-center justify-center overflow-hidden bg-white hover:shadow-md">
                  <img
                    src={img ? URL.createObjectURL(img) : assets.upload_area}
                    alt="upload preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  id={id}
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Product Details */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Dropdowns */}
        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Main Category *</label>
          <select
            value={mainCategory}
            onChange={(e) => {
              setMainCategory(e.target.value);
              setCategory("");
              setSubCategory("");
              setSizes([]);
            }}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
            required
          >
            <option value="">Select</option>
            {Object.keys(productSchema).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Category *</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
            required
          >
            <option value="">Select</option>
            {Object.keys(dynamicCategories).map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Sub Category *</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
            required
          >
            <option value="">Select</option>
            {dynamicSubCategories.map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Product Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Diamond Necklace"
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
            required
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Price (₹) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
            required
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Brand</label>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Material</label>
          <input
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Color</label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Delivery Charge (₹)</label>
          <input
            type="number"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
          />
        </div>

        <div>
          <label className="font-medium text-sm text-[#6b4c3b]">Estimated Delivery (Days)</label>
          <input
            type="number"
            value={estimatedDeliveryDays}
            onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
            className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3]"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="font-medium text-sm text-[#6b4c3b]">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full mt-1 p-2 rounded-md border bg-[#fffaf2] border-[#dbc9a3] resize-none"
          required
        />
      </div>

      {/* Sizes */}
      {dynamicSizes.length > 0 && (
        <div className="mt-6">
          <label className="font-medium text-sm text-[#6b4c3b]">Size Options</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {dynamicSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                  )
                }
                className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
                  sizes.includes(size)
                    ? "bg-[#d6b98c] text-white border-[#d6b98c]"
                    : "bg-white text-[#6b4c3b] border-[#e3d6b1] hover:bg-[#fef6e9]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Best Seller Checkbox */}
      <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          checked={bestSeller}
          onChange={() => setBestSeller((prev) => !prev)}
          className="accent-[#d6b98c]"
        />
        <label className="ml-2 text-sm text-[#6b4c3b]">Mark as Best Seller</label>
      </div>

      {/* Notes */}
      <div className="mt-4 p-3 bg-[#fdf7e9] text-sm text-[#6b4c3b] border border-[#e3d6b1] rounded-md">
        <strong>Note:</strong> Delivery and size info shown to customers during checkout and on the product page.
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`flex justify-center items-center gap-2 px-6 py-2 text-white rounded-md transition ${
            isFormValid && !loading
              ? "bg-[#6b4c3b] hover:bg-[#5a3c2d]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Adding...
            </>
          ) : (
            "Add Product"
          )}
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 bg-[#e3d6b1] text-[#6b4c3b] hover:bg-[#d6b98c] rounded-md transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default Add;
