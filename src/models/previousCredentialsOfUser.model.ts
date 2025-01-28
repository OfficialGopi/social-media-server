import { model, Schema } from "mongoose";
import { IPreviousCredentialsOfUsers } from "../interfaces/models.js";

const previousCredentialsOfUsersSchema =
  new Schema<IPreviousCredentialsOfUsers>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      previousThreePasswords: {
        type: [String],
        default: ["", "", ""],
      },
      previousThreeUsernames: {
        type: [String],
        default: ["", "", ""],
      },
    },
    {
      timestamps: true,
    }
  );

export const PreviousCredentialsOfUsersModel =
  model<IPreviousCredentialsOfUsers>(
    "previouscredentialsofusers",
    previousCredentialsOfUsersSchema
  );
