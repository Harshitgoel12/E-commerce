import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import AdminModel from "../models/Admin.js"; 

dotenv.config(); 

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(` MongoDB connected: ${conn.connection.host}`);

    const existingAdmin = await AdminModel.findOne({ email: 'admin@example.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('adminpass123', 10);

      await AdminModel.create({
        name: 'Admin',
        email: 'admin@example.com',
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
