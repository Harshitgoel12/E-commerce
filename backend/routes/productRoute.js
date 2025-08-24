import express from "express";
import {
  addProduct,
  getSellerProducts,
  getSingleProduct,
  myOrders,
  removeProduct,
  updateProduct,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  trackOrder,
  getSalesStats
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import auth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// =========================
// Public Product Routes
// =========================

productRouter.get("/products",getSellerProducts); // Public product list
productRouter.get("/product/:id", getSingleProduct); // Public product detail

// =========================
// Seller/Admin Product Routes (Protected)
// =========================

productRouter.post(
  "/product",
  auth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

productRouter.put("/product/:id", auth, updateProduct); // Update product
productRouter.delete("/product/:id", auth, removeProduct); // Delete product

// =========================
// Seller Order Routes
// =========================

productRouter.get("/orders", auth, getOrders); // Admin gets all orders
productRouter.get("/order/:id", auth, getOrderDetails); // Order details
productRouter.put("/order/status/:id", updateOrderStatus); // Update order status
productRouter.get("/order/track/:id", auth, trackOrder); // Track order

// =========================
// Seller Dashboard Routes
// =========================

productRouter.get("/myorders", auth, myOrders); // Seller's own orders
productRouter.get("/dashboard/sales", auth, getSalesStats); // Seller sales stats

export default productRouter;
