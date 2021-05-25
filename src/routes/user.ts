import express from "express";
import {
  deleteuser,
  getOneUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { authorizationMiddleware } from "../token";

const router = express.Router();

router.use(authorizationMiddleware);

router.get("/", getUsers);

router.get("/:id", getOneUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteuser);

export default router;
