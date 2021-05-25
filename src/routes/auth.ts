import express from "express";
import {
  loginUser,
  registerUser,
  updateUserPassword,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/password-reset", updateUserPassword);

export default router;
