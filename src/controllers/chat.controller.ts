import {
  badRequestErrorClient,
  notFoundErrorClient,
  okSuccess,
  resourceCreatedSuccess,
  unauthorizedErrorClient,
} from "../constants/statusCode.constant.js";
import { IUser } from "../interfaces/models.js";
import { ChatModel } from "../models/chat.model.js";
import { UserModel } from "../models/user.model.js";
import {
  typeCreateGroupChatRequestBody,
  typeCreatePersonalChatRequestBody,
} from "../types/chatControllers.types.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

//create personal chats
const createPersonalChat = TryCatch(async (req, res) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "User unauthorized");
  }

  const sender = await UserModel.findById(user._id);

  if (!sender) {
    throw new ApiError(notFoundErrorClient, "User not found");
  }

  const { receiver }: typeCreatePersonalChatRequestBody = req.body;

  if (!receiver) {
    throw new ApiError(
      badRequestErrorClient,
      "Sender and receiver are required"
    );
  }

  const users = await UserModel.find({
    _id: { $in: [sender._id, receiver] },
  });

  if (users.length !== 2) {
    throw new ApiError(
      badRequestErrorClient,
      "Sender and receiver are not valid"
    );
  }

  const isChatExist = await ChatModel.findOne({
    isGroup: false,
    members: { $all: [sender._id, receiver] },
  });

  if (isChatExist) {
    throw new ApiError(badRequestErrorClient, "Personal Chat already exists");
  }

  const chat = await ChatModel.create({
    isGroup: false,
    members: [sender._id, receiver],
  });

  res.status(resourceCreatedSuccess).json(
    new ApiResponse(
      resourceCreatedSuccess,
      {
        chat: chat._id,
      },
      "Personal Chats created successfully"
    )
  );
});

//create group chats
const createGroupChat = TryCatch(async (req, res) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(
      unauthorizedErrorClient,
      "User is required to create a group chat"
    );
  }

  const creator = await UserModel.findById(user._id);

  if (!creator) {
    throw new ApiError(
      notFoundErrorClient,
      "User not found to create a group chat"
    );
  }

  const {
    members,
    groupName,
    groupDescription = "",
  }: typeCreateGroupChatRequestBody = req.body;

  if (!members || !groupName) {
    throw new ApiError(
      badRequestErrorClient,
      "Creator, members and groupName are required"
    );
  }

  const users = await UserModel.find({
    _id: { $in: [...members] },
  });

  if (users.length !== members.length) {
    throw new ApiError(badRequestErrorClient, "Members are not valid");
  }

  const chat = await ChatModel.create({
    isGroup: true,
    members: [...members, creator._id],
    groupName,
    groupDescription,
    groupAdmin: creator,
  });

  res.status(resourceCreatedSuccess).json(
    new ApiResponse(
      resourceCreatedSuccess,
      {
        chat: chat._id,
      },
      "Group Chat created successfully"
    )
  );
});

//get chats
const getChats = TryCatch(async (req, res) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(
      unauthorizedErrorClient,
      "You are not logged in. Please login to continue"
    );
  }

  const chats = await ChatModel.find({
    members: {
      $elemMatch: {
        $eq: user._id,
      },
    },
  });

  res
    .status(okSuccess)
    .json(new ApiResponse(okSuccess, chats, "Chats retrieved successfully"));
});

export { createPersonalChat, createGroupChat, getChats };
