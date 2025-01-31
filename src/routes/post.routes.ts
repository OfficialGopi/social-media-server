import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  editPost,
  sharePost,
  toogleLikePost,
  deleteCommentOnPost,
  replyOnCommentOnPost,
  deleteReplyOnCommentOnPost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const post = Router();

post
  .route("/:post")
  .post(upload.array("attachments", 10), verifyJWT, createPost)
  .put(verifyJWT, editPost)
  .delete(verifyJWT, deletePost);

post.route("/like/:post").patch(verifyJWT, toogleLikePost);

post
  .route("/comment/:post")
  .post(verifyJWT, commentOnPost)
  .delete(verifyJWT, deleteCommentOnPost);

post
  .route("/reply/:post/:commentId")
  .post(verifyJWT, replyOnCommentOnPost)
  .delete(verifyJWT, deleteReplyOnCommentOnPost);
post.route("/share/:post").patch(verifyJWT, sharePost);

export { post };
