import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import AdminModel from "../models/Admin.js"; 
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(` MongoDB connected: ${conn.connection.host}`);

    const existingAdmin = await AdminModel.findOne({ email: process.env.ADMIN_EMAIL});

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await AdminModel.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });

      console.log(" Admin user created.");
    } else {
      console.log("ℹ Admin already exists.");
    }
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
