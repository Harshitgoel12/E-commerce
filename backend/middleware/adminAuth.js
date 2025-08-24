import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import AdminModel from "../models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  try {
    let token = req.cookies?.authToken;
console.log("token is ",token)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.body.token) {
      token = req.body.token;
    }
   

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account = null;

    if (decoded.role === "admin") {
      account = await AdminModel.findById(decoded.id).select("-password");
    } else {
      account = await userModel.findById(decoded.id).select("-password");
    }

    if (!account) {
      return res.status(401).json({ message: "Unauthorized: Account not found" });
    }

    req.user = account;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default auth;
