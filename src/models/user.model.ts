import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/models.js";
import { female, male, others } from "../constants/gender.constant.js";
import bcrypt from "bcryptjs";
import {
  accessTokenExpiry,
  accessTokenSecret,
  passwordSaltRound,
  refreshTokenExpiry,
  refreshTokenSecret,
} from "../constants/env.constants.js";
import jwt from "jsonwebtoken";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      requried: true,
    },
    bio: {
      type: String,
      length: {
        max: 150,
      },
    },
    gender: {
      type: String,
      required: true,
      enum: [male, female, others],
    },
    websites: {
      type: [String],
      default: [],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) {
    next();
  } else {
    this.password = await bcrypt.hash(this.password, passwordSaltRound);
  }
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      gmail: this.gmail,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      bio: this.bio,
      gender: this.gender,
      websites: this.websites,
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiry,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiry,
    }
  );
};

export const UserModel = model<IUser>("users", userSchema);
