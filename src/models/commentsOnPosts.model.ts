import { model, Schema } from "mongoose";
import { ICommentsOnPosts } from "../interfaces/models.js";

const commentsOnPostsSchema = new Schema<ICommentsOnPosts>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "posts",
    },
    comment: {
      type: String,
      required: true,
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    replyOnCommentId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

export const CommentsOnPostsModel = model<ICommentsOnPosts>(
  "commentsonposts",
  commentsOnPostsSchema
);
