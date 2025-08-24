import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Order from "../models/Order.js";

// ------------------------- PRODUCT CONTROLLERS -------------------------

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      mainCategory,
      category,
      subCategory,
      sizes,
      bestSeller,
      brand,
      material,
      color,
      deliveryCharge,
      estimatedDeliveryDays,
    } = req.body;

    if (!name || !description || !price || !mainCategory || !category || !subCategory) {
      return res.status(400).json({ success: false, message: "Missing required product fields." });
    }

    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const product = new productModel({
      name,
      description,
      price: Number(price),
      mainCategory,
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      bestSeller: bestSeller === "true",
      brand: brand || "",
      material: material || "",
      color: color || "",
      deliveryCharge: deliveryCharge ? Number(deliveryCharge) : 0,
      estimatedDeliveryDays: estimatedDeliveryDays ? Number(estimatedDeliveryDays) : 3,
      images: imageUrls,
      sellerId: req.user._id, 
      date: Date.now(),
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// Get all products for current seller
const getSellerProducts = async (req, res) => {
  try {
    
    const products = await productModel.find({}).sort({ date: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// Update a product
const updateProduct = async (req, res) => {
  try {
    const id=req.params.id;
    const {  name, price, description } = req.body;

    if (!id || !name || !price || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: id, sellerId: req.user._id },
      { name, price, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a product
const removeProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const deleted = await productModel.findOneAndDelete({ _id: id});

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    return res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single product
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findOne({ _id: id});

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------- ORDER CONTROLLERS ---------------------------

// Get all orders for seller
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a specific order
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order Details Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id},
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Order not found or unauthorized" });

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id});

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, status: order.status });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------- SALES STATS -------------------------

const getSalesStats = async (req, res) => {
  try {
    const { range } = req.query;

    const now = new Date();
    const match = {
      isPaid: true, 
    };

   
    if (range === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      match.createdAt = { $gte: startOfMonth };
    } else if (range === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      match.createdAt = { $gte: startOfYear };
    }

    // Group format
    let groupFormat = "%Y-%m-%d"; // daily for month
    if (range === "year") groupFormat = "%Y-%m"; // monthly for year

    const sales = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupFormat, date: "$createdAt" } },
          },
          totalSales: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    const formattedSales = sales.map(item => ({
      label: item._id.date,
      totalSales: item.totalSales,
      orderCount: item.totalOrders,
    }));

    const totalSales = formattedSales.reduce((acc, curr) => acc + curr.totalSales, 0);
    const totalOrders = formattedSales.reduce((acc, curr) => acc + curr.orderCount, 0);

    return res.json({
      success: true,
      data: {
        totalSales,
        orderCount: totalOrders,
        sales: formattedSales,
      },
    });
  } catch (err) {
    console.error("Sales Stats Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ------------------------- USER ORDERS -------------------------

const myOrders = async (req, res) => {
  try {
   
    const user = await userModel.findById(req.user._id).populate("orders");

    if (!user) return res.status(400).json({ success: false, message: "Invalid user" });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: user.orders,
    });
  } catch (error) {
    console.error("My Orders Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------ EXPORTS ------------------------

export {
  addProduct,
  getSellerProducts,
  getSingleProduct,
  updateProduct,
  removeProduct,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  trackOrder,
  getSalesStats,
  myOrders,
};
