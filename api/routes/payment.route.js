import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  verifyPayment,
  createNewCoupon,
} from "../controllers/payment.controller.js";
const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/verify-payment", protectRoute, verifyPayment);
router.post("/createNewCoupon", protectRoute, adminRoute, createNewCoupon);

export default router;
