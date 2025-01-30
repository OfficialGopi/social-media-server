import {
  badRequestErrorClient,
  resourceCreatedSuccess,
} from "../constants/statusCode.constant.js";
import { ChatModel } from "../models/chat.model.js";
import { UserModel } from "../models/user.model.js";
import {
  typeCreateGroupChatRequestBody,
  typeCreatePersonalChatRequestBody,
} from "../types/chatControllers.types.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

const createPersonalChat = TryCatch(async (req, res) => {
  const { sender, receiver }: typeCreatePersonalChatRequestBody = req.body;

  if (!sender || !receiver) {
    throw new ApiError(
      badRequestErrorClient,
      "Sender and receiver are required"
    );
  }

  const users = await UserModel.find({
    _id: { $in: [sender, receiver] },
  });

  if (users.length !== 2) {
    throw new ApiError(
      badRequestErrorClient,
      "Sender and receiver are not valid"
    );
  }

  const isChatExist = await ChatModel.findOne({
    isGroup: false,
    members: { $all: [sender, receiver] },
  });

  if (isChatExist) {
    throw new ApiError(badRequestErrorClient, "Personal Chat already exists");
  }

  const chat = await ChatModel.create({
    isGroup: false,
    members: [sender, receiver],
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

const createGroupChat = TryCatch(async (req, res) => {
  const {
    creator,
    members,
    groupName,
    groupDescription,
  }: typeCreateGroupChatRequestBody = req.body;

  const users = await UserModel.find({
    _id: { $in: [...members, creator] },
  });

  if (users.length !== members.length + 1) {
    throw new ApiError(badRequestErrorClient, "Members are not valid");
  }

  const chat = await ChatModel.create({
    isGroup: true,
    members: [...members, creator],
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

export { createPersonalChat, createGroupChat };
