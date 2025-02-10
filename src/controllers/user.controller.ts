import {
  badRequestErrorClient,
  noAccessErrorClient,
  notFoundErrorClient,
  okSuccess,
  resourceCreatedSuccess,
  unauthorizedErrorClient,
} from "../constants/statusCode.constant.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

import {
  typeLoginUserRequestBody,
  typeSignupUserRequestBody,
  typeEditUserRequestBody,
} from "../types/userControllers.types.js";
import { accessTokenAndRefreshTokenGenerateAndSave } from "../helper/accessTokenAndRefreshTokenGenerateAndSave.js";
import { refreshTokenSecret } from "../constants/env.constants.js";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/models.js";
import { FollowersModel } from "../models/followers.model.js";

//signup
const signupUser = TryCatch(async (req, res, _) => {
  const {
    username,
    gmail,
    password,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    bio,
    gender,
  }: typeSignupUserRequestBody = req.body;

  if (!(username && gmail && password && firstName && dateOfBirth && gender)) {
    throw new ApiError(badRequestErrorClient, "All * fields are required");
  }

  const isUserExists = await UserModel.findOne({ username });

  if (isUserExists) {
    throw new ApiError(badRequestErrorClient, "Username already taken");
  }

  const newUser = await UserModel.create({
    username,
    password,
    gmail,
    firstName,
    middleName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    bio,
    gender,
  });

  res.status(resourceCreatedSuccess).json(
    new ApiResponse(resourceCreatedSuccess, {
      username: newUser.username,
      gmail: newUser.gmail,
      firstName: newUser.firstName,
      middleName: newUser.middleName,
      lastName: newUser.lastName,
      dateOfBirth: newUser.dateOfBirth,
      bio: newUser.bio,
      gender: newUser.gender,
    })
  );
});

//login
const loginUser = TryCatch(async (req, res, _) => {
  const { userAccessDetails, password }: typeLoginUserRequestBody = req.body;

  if (!userAccessDetails || !password) {
    throw new ApiError(badRequestErrorClient, "All fields required");
  }

  const user = await UserModel.findOne({
    $or: [
      {
        username: userAccessDetails,
      },
      {
        gmail: userAccessDetails,
      },
    ],
  });

  if (!user) {
    throw new ApiError(notFoundErrorClient, "Incorrect User Details");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(noAccessErrorClient, "Incorrect User Details");
  }

  const tokens = await accessTokenAndRefreshTokenGenerateAndSave(user.id);

  if (!tokens.success || !tokens.data) {
    throw new ApiError(tokens.status, tokens.message);
  }

  const userInfo = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userInfo) {
    throw new ApiError(
      badRequestErrorClient,
      "User not found after generating tokens"
    );
  }

  res.status(okSuccess).json(
    new ApiResponse(okSuccess, {
      tokens: {
        accessToken: tokens.data.accessToken,
        refreshToken: tokens.data.refreshToken,
      },
      info: userInfo,
    })
  );
});

//logout
const logoutUser = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;
  if (!user._id) {
    throw new ApiError(badRequestErrorClient, "User Id not found");
  }

  const userData = await UserModel.findByIdAndUpdate(user._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  if (!userData) {
    throw new ApiError(badRequestErrorClient, "User not found");
  }

  res
    .status(okSuccess)
    .json(new ApiResponse(okSuccess, {}, "Logout Successfully"));
});

//refresh accessToken
const refreshAccessToken = TryCatch(async (req, res, _) => {
  const refreshToken = req.header("refresh-token")?.replace("Bearer ", "");

  if (!refreshToken) {
    throw new ApiError(unauthorizedErrorClient, "Token required");
  }

  const decodedToken = jwt.verify(
    refreshToken,
    refreshTokenSecret
  ) as unknown as {
    _id: string;
  };

  if (!decodedToken || !decodedToken._id) {
    throw new ApiError(badRequestErrorClient, "Invalid Token");
  }

  const user = await UserModel.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(notFoundErrorClient, "Invalid Token");
  }

  if (user.refreshToken !== refreshToken) {
    throw new ApiError(badRequestErrorClient, "Used Token");
  }

  const newTokens = await accessTokenAndRefreshTokenGenerateAndSave(user.id);

  res.status(okSuccess).json(new ApiResponse(okSuccess, newTokens));
});

//autologin
const autoLogin = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const userInfo = await UserModel.findById(user._id).select("-password");

  if (!userInfo) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const newTokens = await accessTokenAndRefreshTokenGenerateAndSave(
    userInfo.id
  );

  if (!newTokens.success || !newTokens.data) {
    throw new ApiError(newTokens.status, newTokens.message);
  }

  const userData = await UserModel.findById(user._id).select(
    "-password -refreshToken"
  );

  res.status(okSuccess).json(
    new ApiResponse(okSuccess, {
      tokens: {
        accessToken: newTokens.data.accessToken,
        refreshToken: newTokens.data.refreshToken,
      },
      info: userData,
    })
  );
});

//edit user
const editUser = TryCatch(async (req, res, _) => {
  const reqUser = req.user as unknown as IUser;

  if (!reqUser) {
    throw new ApiError(unauthorizedErrorClient, "User not found");
  }

  const user = await UserModel.findById(reqUser._id);

  if (!user) {
    throw new ApiError(notFoundErrorClient, "User not found");
  }

  const {
    username,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    bio,
    gender,
    isPrivate,
  }: typeEditUserRequestBody = req.body;

  if (username) {
    const isUsernameExists = await UserModel.findOne({ username });

    if (isUsernameExists) {
      throw new ApiError(badRequestErrorClient, "Username already taken");
    } else {
      user.username = username;
    }
  }

  if (firstName) {
    user.firstName = firstName;
  }

  if (middleName) {
    user.middleName = middleName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (dateOfBirth) {
    user.dateOfBirth = new Date(dateOfBirth);
  }

  if (bio) {
    user.bio = bio;
  }

  if (gender) {
    user.gender = gender;
  }

  if (isPrivate !== undefined) {
    if (user.isPrivate !== isPrivate) {
      user.isPrivate = isPrivate;
    }
  }
  const updatedUser = await user.save();

  const tokens = await accessTokenAndRefreshTokenGenerateAndSave(
    updatedUser.id
  );

  if (!tokens.success || !tokens.data) {
    throw new ApiError(tokens.status, tokens.message);
  }

  const userInfo = await UserModel.findById(updatedUser._id).select(
    "-password -refreshToken"
  );

  if (!userInfo) {
    throw new ApiError(
      badRequestErrorClient,
      "User not found after generating tokens"
    );
  }

  res.status(okSuccess).json(
    new ApiResponse(okSuccess, {
      tokens: {
        accessToken: tokens.data.accessToken,
        refreshToken: tokens.data.refreshToken,
      },
      info: userInfo,
    })
  );
});

const getUserData = TryCatch(async (req, res) => {
  const { username }: { username?: string } = req.params;

  if (!username) {
    throw new ApiError(badRequestErrorClient, "Username is required");
  }

  const user = await UserModel.findOne({ username }).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(notFoundErrorClient, "user not found");
  }

  const followings = await FollowersModel.find({
    follower: user._id,
  });

  const followers = await FollowersModel.find({
    following: user._id,
  });

  res.status(200).json(
    new ApiResponse(
      okSuccess,
      {
        user,
        followers,
        followings,
      },
      "User Data retreived successfully"
    )
  );
});

export {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  autoLogin,
  editUser,
  getUserData,
};
