import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago in ms

    const dailyData = await getDailySalesData(startDate, endDate);

    res.json({
      dailyData,
      analyticsData,
    });
  } catch (error) {
    console.log("Server Error inside the analytics Data" + error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
});

export default router;
