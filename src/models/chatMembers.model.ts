import { model, Schema } from "mongoose";
import { IChatMembers } from "../interfaces/models.js";

const chatMembersSchema = new Schema<IChatMembers>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    chat: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chats",
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMembersModel = model<IChatMembers>(
  "chatmembers",
  chatMembersSchema
);
