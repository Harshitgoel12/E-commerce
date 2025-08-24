import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import OTPModel from "../models/OtpModel.js";
import AdminModel from "../models/Admin.js";
import sendMail from "../utils/SendMail.js";
import { otpGen } from "otp-gen-agent";

dotenv.config();
// Create JWT Token
const createToken =async (payload) => {
  return await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ======================= LOGIN USER =======================
const loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email: Email });
    if (!user || !(await bcrypt.compare(Password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = await createToken({ id: user._id, role: user.role });

    return res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token
      });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ======================= SEND OTP =======================
const sendOTP = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email ) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const existingUser = await userModel.findOne({ email: Email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }
const otp = Math.floor(100000 + Math.random() * 900000);
    const sent = await sendMail(otp, Email, "YukiLux: Email Verification Code");

    if (!sent) {
     
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }

    await OTPModel.create({  OTP: otp,Email });
    return res.status(200).json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.log("error")
    if (process.env.NODE_ENV !== "production") console.error("Send OTP error:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ======================= VERIFY OTP & REGISTER =======================
const verifyOTP = async (req, res) => {
  try {
    const { otp, Email, Name, Password, Role = "user" } = req.body;

    if (!otp || !Email || !Password || !Name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!["user", "seller"].includes(Role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const existingUser = await userModel.findOne({ email: Email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already registered" });
    }

    const otps = await OTPModel.find({ Email }).sort({ createdAt: -1 });
    if (!otps.length) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const latestOTP = otps[0];
    await OTPModel.deleteMany({ Email, _id: { $ne: latestOTP._id } });

    const isExpired = (new Date() - latestOTP.createdAt) / 60000 > 5;
    if (isExpired) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (latestOTP.OTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await userModel.create({
      name: Name,
      email: Email,
      password: hashedPassword,
      role: Role,
    });

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Verify OTP error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ======================= REGISTER (Direct) =======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!["user", "seller"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = createToken({ id: user._id, role });

    res.status(200).json({ success: true, token });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ======================= ADMIN LOGIN =======================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await AdminModel.findOne({ email });
    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = await createToken({ id: admin._id, role: admin.role });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    }).status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Admin login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================= LOGOUT =======================
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};




const ResendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    await OTPModel.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

   

    // Save OTP to DB with expiry (e.g., 10 minutes)
    await OTPModel.create({
      Email:email,
      OTP:otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    
    const response=await sendMail(otp,email,"YukiLux: Email Verification Code");
if(!response){
  return res.status(400).json({success:false,message:"Failed TO send OTP"});
}
    return res.status(200).json({ success: true, message: "OTP resent successfully." });

  } catch (error) {
    console.error("Error while resending OTP:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};












// ======================= EXPORTS =======================
export {
  loginUser,
  registerUser,
  loginAdmin,
  verifyOTP,
  sendOTP,
  logoutUser,
  ResendOTP
};
