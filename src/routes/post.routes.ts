import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  editPost,
  sharePost,
  toogleLikePost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const post = Router();

post
  .route("/:post")
  .post(upload.array("attachments", 10), verifyJWT, createPost)
  .put(verifyJWT, editPost)
  .delete(verifyJWT, deletePost);

post.route("/like/:post").patch(verifyJWT, toogleLikePost);

post.route("/comment/:post").post(verifyJWT, commentOnPost);
post.route("/reply/:post/:commentId").post(verifyJWT, commentOnPost);

post.route("/share/:post").patch(verifyJWT, sharePost);

export { post };
