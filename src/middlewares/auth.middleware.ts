import {
  accessTokenSecret,
  refreshTokenSecret,
} from "../constants/env.constants.js";
import {
  badRequestErrorClient,
  notFoundErrorClient,
  okSuccess,
  unauthorizedErrorClient,
} from "../constants/statusCode.constant.js";
import { accessTokenAndRefreshTokenGenerateAndSave } from "../helper/accessTokenAndRefreshTokenGenerateAndSave.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";
import jwt from "jsonwebtoken";

const verifyJWT = TryCatch(async (req, _, next) => {
  const accessToken = req.header("access-token")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(unauthorizedErrorClient, "Token required");
  }

  const decodedToken = jwt.verify(
    accessToken,
    accessTokenSecret
  ) as unknown as {
    _id: string;
    [key: string]: any;
  };

  if (!decodedToken || !decodedToken._id) {
    throw new ApiError(badRequestErrorClient, "Invalid Token");
  }

  const user = await UserModel.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(notFoundErrorClient, "Invalid Token");
  }

  req.user = user;

  next();
});

export { verifyJWT };
