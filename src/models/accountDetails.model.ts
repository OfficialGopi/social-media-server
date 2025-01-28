import { model, Schema } from "mongoose";
import { IAccountDetails } from "../interfaces/models.js";

const accountDetailsSchema = new Schema<IAccountDetails>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const AccountDetailsModel = model<IAccountDetails>(
  "accountdetails",
  accountDetailsSchema
);
