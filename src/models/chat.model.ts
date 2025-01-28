import { model, Schema } from "mongoose";
import { IChat } from "../interfaces/models.js";

const chatSchema = new Schema<IChat>(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
    },
    groupDescription: {
      type: String,
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = model<IChat>("chats", chatSchema);
