import { model, Schema } from "mongoose";
import { IChatMessages } from "../interfaces/models.js";

const chatMessagesSchema = new Schema<IChatMessages>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chats",
    },
    member: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chatmembers",
    },
    message: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessagesModel = model<IChatMessages>(
  "chatmessages",
  chatMessagesSchema
);
