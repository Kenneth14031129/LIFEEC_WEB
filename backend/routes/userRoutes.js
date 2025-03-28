import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUsers,
  addUser,
  changePassword,
  archiveUser,
  getArchivedUsers,
  restoreUser,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  verifyUser,
  rejectUser,
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/", protect, getUsers);
router.post("/add", protect, addUser);
router.put("/:id/archive", protect, archiveUser);
router.get("/archived", protect, getArchivedUsers);
router.put("/:id/restore", protect, restoreUser);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", protect, resetPassword);
router.put("/:id/verify", protect, verifyUser);
router.put("/:id/reject", protect, rejectUser);

export default router;
