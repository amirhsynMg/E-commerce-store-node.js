import express from "express";
import {
  login,
  logout,
  sighnup,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";

import {protectRoute} from "../middleware/auth.middleware.js"
const router = express.Router();

router.post("/sighnup", sighnup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.get("/profile", protectRoute, getProfile);
export default router;
