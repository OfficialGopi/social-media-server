import { model, Schema } from "mongoose";
import { IPosts } from "../interfaces/models.js";

const postsSchema = new Schema<IPosts>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    caption: {
      type: String,
      required: true,
    },
    isReel: {
      type: Boolean,
      default: false,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PostsModel = model<IPosts>("posts", postsSchema);
