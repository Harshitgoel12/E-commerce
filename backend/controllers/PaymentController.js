
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
dotenv.config();

export const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: req.body.amount,
      currency: req.body.currency,
      receipt: req.body.receipt,
      notes: req.body.notes,
    });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Order creation failed', error });
  }
};




export const verifyPayment = async (req, res) => {
  try {
    const userdata=req.user;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      items,
      amount,
    } = req.body;

   
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid Razorpay signature' });
    }

   
    const processedItems = items.map(item => ({
      ...item,
      images: Array.isArray(item.images) ? item.images[0] : item.images, 
    }));

    const newOrder = new Order({
      user,
      items: processedItems,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isPaid: true,
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();

   
    const existingUser = await userModel.findById(userdata._id);
    if (existingUser) {
      if (!Array.isArray(existingUser.orders)) existingUser.orders = [];
      existingUser.orders.push(savedOrder._id);
      await existingUser.save();
    }

   
    return res.status(200).json({ message: 'Order verified and saved successfully.' });

  } catch (error) {
    console.error('Payment Verification Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
