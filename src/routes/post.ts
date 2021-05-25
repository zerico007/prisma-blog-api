import express from "express";
import {
  createPost,
  deletePost,
  getFeed,
  getOnePost,
  getPosts,
  publishPost,
  updatePost,
} from "../controllers/postController";
import { authorizationMiddleware } from "../token";

const router = express.Router();

router.use(authorizationMiddleware);

router.get("/feed", getFeed);

router.get("/", getPosts);

router.post("/", createPost);

router.get("/:id", getOnePost);

router.delete("/:id", deletePost);

router.put("/:id", updatePost);

router.put("/publish/:id", publishPost);

export default router;
