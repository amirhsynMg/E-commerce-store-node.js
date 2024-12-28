import Coupon from "../models/coupons.module.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error inside the getCoupon controller");
    res.status(500).json({ message: "server Error: ", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code,
      isActive: true,
      userId: req.user._id,
    });

    if (!coupon) {
      res.status(404).json({ message: "coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.expirationDate = false;
      await coupon.save();
      res.status(404).json({ message: "coupon has expired" });
    }

    res.json({
      message: "coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error inside the validateCoupon controller: " + error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
