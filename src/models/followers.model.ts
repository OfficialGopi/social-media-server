import { model, Schema } from "mongoose";
import { IFollowers } from "../interfaces/models.js";

const followersSchema = new Schema<IFollowers>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FollowersModel = model<IFollowers>("followers", followersSchema);
