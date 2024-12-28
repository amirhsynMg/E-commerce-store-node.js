import Coupon from "../models/coupons.module.js";
import { zarinpal } from "../lib/zarinpal.js";
import Order from "../models/order.module.js";
import Stripe from "stripe";

export const createCheckoutSession = async (req, res) => {
  try {
    const { couponCode, products } = req.body;

    // check if the products format is in array or its empty
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "invalid or empty products array" });
    }

    let totalAmount = 0;

    products.map((product) => {
      totalAmount += amount * product.quantity; // chand tedad az oon mahsool hast
    });

    // apply coupon
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(totalAmount * coupon.discountPercentage);
      }
    }

    const session = zarinpal.PaymentRequest({
      Amount: totalAmount, // In Rial
      CallbackURL: "https://localhost:5000/api/payment/verify-payment",
      Description: "A Payment from user",
      Email: req.user.email,
    })
      .then((response) => {
        if (response.status === 100) {
          const order = new Order({
            user: req.user._id,
            products,
            totalAmount,
          });
          order.save();
          console.log(response.url);
          res.status(200).json({
            message: "session created",
            response: response.url,
            totalAmount,
          });
        }
      })
      .catch((err) => {
        console.error("Error creating a session: " + err.message);
        res.status(500).json("payment request failed" + err.message);
      });
  } catch (error) {
    console.log("Server Error " + error.message);
  }
};

export const verifyPayment = async (req, res) => {
  
  const response = zarinpal.PaymentVerification({
    Amount: req.body.totalAmount, // In Rials
    Authority: req.query.Authority,
  })
    .then((response) => {
      if (response.status !== 100) {
        res
          .status(400)
          .json({ message: "payment request was not successfull" });
      } else {

        res.status(200).json({
          message: "successfull payment request",
          RefId: response.RefID,
        });
      }
    })
    .catch((err) => {
      console.error(
        "server Error inside the verifyPayment controller " + err.message
      );
    });
};

export const createNewCoupon = async (userId) => {
  try {
    const { discountPercentage, CouponCode, expirationDate } = req.body;

    if (discountPercentage && couponCode && expirationDate) {
      const newCoupon = new Coupon({
        code: CouponCode,
        expirationDate,
        discountPercentage,
      });
      await newCoupon.save();

      res.json({ message: "coupon created successfuly", newCoupon });
    }

    res.status(500).json({ message: "bad request" });
  } catch (error) {
    console.log("Error inside the createNewCoupon controller" + error.message);
    res.status(500).json({ message: "server Error", error: error.message });
  }
};
