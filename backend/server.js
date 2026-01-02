import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import cookieParser from "cookie-parser";
import router from "./routes/RatingandReviewRoute.js"; 
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Connect DB + Cloudinary
connectDB()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err.message));

connectCloudinary();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [process.env.ORIGIN, "https://e-commerce-yadr.vercel.app","https://localhost:5173","https://e-commerce-zeta-tan.vercel.app/"."*"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => res.send("hello ✅ backend running"));

app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/review", router);

// Start server
app.listen(port, () =>
  console.log(`🚀 Server is running at http://localhost:${port}`)
);
