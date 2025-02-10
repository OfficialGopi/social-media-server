import { model, Schema } from "mongoose";
import { IChatMessages } from "../interfaces/models.js";

const chatMessagesSchema = new Schema<IChatMessages>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chats",
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
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
    deletedForWhom: {
      type: [Schema.ObjectId],
      default: [],
      ref: "users",
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
