import express from "express";

import { verifyPayment } from "../controllers/PaymentController.js";
import { createOrder } from "../controllers/PaymentController.js";
import auth from "../middleware/adminAuth.js"
import dotenv from 'dotenv';

dotenv.config();

const paymentRoutes = express.Router();
console.log(paymentRoutes)

paymentRoutes.post('/create-order',auth, createOrder);
paymentRoutes.post('/verify',auth, verifyPayment);


export default paymentRoutes;