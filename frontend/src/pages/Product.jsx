import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Drift from "drift-zoom";
import "drift-zoom/dist/drift-basic.min.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { assets } from "../assets/assets";
import productpage from "../assets/productpage.png";
import { toast } from "react-toastify";
import clothesImage from "../assets/clothesImage.png"
import api from "../api/axios";

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    text: "",
    image: null,
    preview: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 3;

  const Cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.singupData?.userData);

  const imgRef = useRef(null);
  const paneRef = useRef(null);
  const driftInstance = useRef(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes,reviewRes] = await Promise.all([
          api.get(`/product/${productId}`),
        api.get(`/review/${productId}`),
        ]);

        setProductData(productRes.data.product);
        setSelectedImage(productRes.data.product.images?.[0] || "");
        setReviews(reviewRes.data.reviews || []);
      } catch (err) {
        console.error("Error loading product:", err);
        toast.error("Failed to Load Product Details ",{
          position:"top-center"
        })
      } finally {
        setLoading(false);
       }
    };

    fetchData();
  }, [productId]);

  
  useEffect(() => {
    if (imgRef.current && selectedImage) {
      if (driftInstance.current) {
        driftInstance.current.disable();
        driftInstance.current = null;
      }

      driftInstance.current = new Drift(imgRef.current, {
        paneContainer: paneRef.current,
        inlinePane: false,
        containInline: true,
      });
    }
  }, [selectedImage]);

 
  const handleAddToCart = () => {
    if (!productData) return;

    if (!selectedSize && productData.sizes?.length > 0) {
      alert("Please select a size.");
      return;
    }

    const alreadyInCart = Cart.find((item) => item._id === productData._id);
    if (alreadyInCart) {
      toast.error("Product is already in the cart.", {
  position: "top-center", 
});
return;
    }

    setAddingToCart(true);
    setTimeout(() => {
      const item = {
        ...productData,
        quantity: 1,
        selectedSize,
      };

      dispatch(addToCart(item));
      const updatedCart = [...Cart, item];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setAddingToCart(false);
    }, 800);
  };

 
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewForm.rating || !reviewForm.text.trim()) {
      toast.error("Please provide a rating and review.",{
        position:"top-center"
      });
      return;
    }

    if (!user) {
      toast.error("Please login to leave a review.",{
        position:"top-center"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rating", reviewForm.rating);
      formData.append("text", reviewForm.text);
      formData.append("name", user.name || "Anonymous");
      if (reviewForm.image) formData.append("image", reviewForm.image);

      const res = await api.post(
        `/review/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setReviews((prev) => [res.data.review, ...prev]);
        setReviewForm({ rating: 0, text: "", image: null, preview: null });
        setCurrentPage(1);
        toast.success("Review submited Successfully",{
          position:"top-center"
        })
      }
    } catch (err) {
      
      toast.error("Failed to submit review.",{
        position:"top-center"
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewForm((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  if (loading)
    return <div className="text-center py-10">Loading...</div>;
  if (!productData)
    return (
      <div className="text-center text-red-500 py-10">
        Product not found
      </div>
    );

  const {
    name,
    description,
    brand,
    material,
    color,
    price,
    sizes,
    images,
    estimatedDeliveryDays,
    deliveryCharge,
    bestSeller,
    mainCategory,
    category,
    subCategory,
  } = productData;

  return (
    <div className="px-4 sm:px-10 py-10 text-gray-800 bg-white">
   
      <div className="flex flex-col lg:flex-row gap-10">
       
        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-1/2">
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:w-20">
            {images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition ${
                  selectedImage === img
                    ? "border-black"
                    : "border-gray-300 hover:border-black"
                }`}
              />
            ))}
          </div>

          <div
            ref={paneRef}
            className="relative w-11/12 h-[300px] sm:h-[500px] flex items-center justify-center border rounded-2xl bg-gradient-to-br from-white to-yellow-50 shadow"
          >
            {selectedImage && (
              <img
                ref={imgRef}
                src={selectedImage}
                data-zoom={selectedImage}
                alt={name}
                className="max-w-full max-h-full object-contain cursor-crosshair"
              />
            )}
            {bestSeller && (
              <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded">
                Best Seller
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-semibold">{name}</h1>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.round(averageRating)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                className="w-5"
                alt="star"
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              ({reviews.length} reviews)
            </span>
          </div>

          <p className="text-4xl font-bold">₹{Number(price).toLocaleString()}</p>

          {sizes?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Select Size</p>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 border rounded text-sm ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p>{description}</p>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`mt-4 px-6 py-3 rounded text-white ${
              addingToCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {addingToCart ? "Adding..." : "ADD TO CART"}
          </button>

          <div className="pt-6 border-t text-sm space-y-1 text-gray-600">
            {brand && <p>Brand: {brand}</p>}
            {material && <p>Material: {material}</p>}
            {color && <p>Color: {color}</p>}
            <p>
              Category: {mainCategory} › {category} › {subCategory}
            </p>
            <p>Estimated Delivery: {estimatedDeliveryDays} days</p>
            <p>
              Delivery Charge:{" "}
              {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-yellow-50 rounded-xl px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Where Elegance Meets Emotion
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Each piece of jewellery is more than just gold — it's a celebration of your story.
        </p>
      </div>

      {mainCategory === "Jewellery" && (
  <div className="mt-12 rounded-xl overflow-hidden shadow">
    <img
      src={productpage}
      alt="Jewellery"
      className="w-full h-[350px] object-cover"
    />
  </div>
)}

{mainCategory === "Clothes" && (
  <div className="mt-12 rounded-xl overflow-hidden shadow">
    <img
      src={clothesImage} 
      alt="Clothes"
      className="w-full h-[350px] object-cover"
    />
  </div>
)}


      
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>

        {paginatedReviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          paginatedReviews.map((review, i) => (
            <div
              key={i}
              className="border p-4 rounded bg-white shadow-sm mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, j) => (
                  <img
                    key={j}
                    src={
                      j < review.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    className="w-4"
                    alt="star"
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  by {review.name} •{" "}
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{review.text}</p>
              {review.image && (
                <img
                  src={review.image}
                  alt="Review"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          ))
        )}
        {Math.ceil(reviews.length / REVIEWS_PER_PAGE) > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, Math.ceil(reviews.length / REVIEWS_PER_PAGE))
                )
              }
              disabled={currentPage === Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
        <div className="mt-10 border-t pt-6 max-w-lg">
          <h4 className="text-xl font-semibold mb-4">Write a Review</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating: star }))
                    }
                  >
                    <img
                      src={
                        reviewForm.rating >= star
                          ? assets.star_icon
                          : assets.star_dull_icon
                      }
                      alt="star"
                      className="w-6"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Your Review</label>
              <textarea
                rows="4"
                value={reviewForm.text}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
                className="w-full border p-2 rounded text-sm"
                placeholder="Write your thoughts here..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Upload an Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {reviewForm.preview && (
                <img
                  src={reviewForm.preview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Product;
