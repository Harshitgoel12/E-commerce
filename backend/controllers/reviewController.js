import Review from "../models/Reviews.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/Order.js";

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ date: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addReview = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.params;
    const { name, rating, text } = req.body;

  
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const hasPurchased = await Order.findOne({
  "user._id": userId,
  "items.productId": productId,
});

    if (!hasPurchased) {
      return res.status(403).json({ success: false, message: "You must purchase the product before reviewing." });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product." });
    }

    // Upload image if present
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce/reviews",
        resource_type: "image",
        transformation: [{ width: 800, height: 800, crop: "limit" }],
      });
      imageUrl = result.secure_url;
    }

 
    const newReview = new Review({
      productId,
      userId,
      name,
      rating,
      text,
      image: imageUrl,
    });

    await newReview.save();

   
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.reviews.push(newReview._id);

    const allReviews = await Review.find({ productId });
    const averageRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

    product.averageRating = averageRating;
    await product.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};