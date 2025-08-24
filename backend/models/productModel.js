
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mainCategory: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: { type: [String], required: true },
  bestSeller: { type: Boolean, default: false },
  brand: { type: String, default: "" },
  material: { type: String, default: "" },
  color: { type: String, default: "" },
  deliveryCharge: { type: Number, default: 0 },
  estimatedDeliveryDays: { type: Number, default: 3 },
  images: { type: [String], required: true },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true, // important for seller-specific filtering
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;

