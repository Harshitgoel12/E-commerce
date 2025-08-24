import express from "express";
import  multer from "multer";
import  {
  getReviews,
  addReview,
} from "../controllers/reviewController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/adminAuth.js";
const router = express.Router();


router.get("/:productId", getReviews);
router.post("/:productId", upload.single("image"),auth, addReview);

export default router;
