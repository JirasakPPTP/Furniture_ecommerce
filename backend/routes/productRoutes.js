import { Router } from "express";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/categories/list", getCategories);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

router.post("/categories", protect, adminOnly, createCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

export default router;
