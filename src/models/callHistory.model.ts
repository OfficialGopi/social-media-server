import { model, Schema } from "mongoose";
import { ICallHistory } from "../interfaces/models.js";

const callHistorySchema = new Schema<ICallHistory>({
  call: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "calldetails",
  },
  duration: {
    type: Number,
    required: true,
  },
  isVideoCall: {
    type: Boolean,
    default: false,
  },
});

export const CallHistoryModel = model<ICallHistory>(
  "callhistory",
  callHistorySchema
);
