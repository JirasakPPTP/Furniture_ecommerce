import { Router } from "express";
import { deleteUser, getUsers } from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/", getUsers);
router.delete("/:id", deleteUser);

export default router;
