import { model, Schema } from "mongoose";
import { ICallDetails } from "../interfaces/models.js";

const callDetailsSchema = new Schema<ICallDetails>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chats",
    },
    calling: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chatmembers",
    },
    receiving: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "chatmembers",
    },
  },
  {
    timestamps: true,
  }
);

export const CallDetailsModel = model<ICallDetails>(
  "calldetails",
  callDetailsSchema
);
