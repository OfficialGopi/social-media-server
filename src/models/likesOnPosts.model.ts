import { model, Schema } from "mongoose";
import { ILikesOnPosts } from "../interfaces/models.js";

const likesOnPostsSchema = new Schema<ILikesOnPosts>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LikesOnPostsModel = model<ILikesOnPosts>(
  "likesonposts",
  likesOnPostsSchema
);
