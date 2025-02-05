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
  getMyPosts,
  getOthersPosts,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const post = Router();

post.route("/").get(verifyJWT, getMyPosts);
post.route("/:userId").get(verifyJWT, getOthersPosts);
post.route("/").post(upload.array("attachments", 10), verifyJWT, createPost);
post.route("/:post").put(verifyJWT, editPost).delete(verifyJWT, deletePost);

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
