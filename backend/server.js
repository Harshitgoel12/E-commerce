import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import cookieParser from 'cookie-parser';
import router from "../backend/routes/RatingandReviewRoute.js"


const app = express();
const port = process.env.PORT || 4000;
connectDB().then((res)=>{
  console.log("Connect to db successfully")
}).catch((err)=>{
  console.log("Not able to connect with mongodb",err.message)
})
connectCloudinary();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin:["http://localhost:5173","http://localhost:5174"],
  methods:["POST","GET","DELETE","PUT","PATCH"],
  credentials:true
}));


app.get("/",async(req,res)=>{
  res.send("hello")
})


app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use('/api/v1/payment', paymentRoutes);
app.use("/api/v1/review",router);





app.listen(port, () =>
  console.log(`Server is running on at http://localhost:${port}`)
);
