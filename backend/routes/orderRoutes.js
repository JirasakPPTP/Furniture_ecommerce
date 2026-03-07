import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", adminOnly, updateOrderStatus);

export default router;
