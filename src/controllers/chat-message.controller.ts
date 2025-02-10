import {
  badRequestErrorClient,
  notFoundErrorClient,
  okSuccess,
  resourceCreatedSuccess,
  unauthorizedErrorClient,
} from "../constants/statusCode.constant.js";
import { IUser } from "../interfaces/models.js";
import { ChatModel } from "../models/chat.model.js";
import { ChatMessagesModel } from "../models/chatMessage.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

//send message
const sendMessage = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "Unauthorized");
  }

  const {
    chatId,
    message,
  }: {
    chatId: string;
    message: string;
  } = req.body;

  if (!chatId || !message) {
    throw new ApiError(
      badRequestErrorClient,
      "Chat id and message must be provided"
    );
  }

  const sender = await UserModel.findById(user._id);

  if (!sender) {
    throw new ApiError(unauthorizedErrorClient, "Unauthorized");
  }

  const chat = await ChatModel.findById(chatId);

  if (!chat) {
    throw new ApiError(unauthorizedErrorClient, "Chat is not found");
  }

  const attachments = [];

  const files = req.files as Express.Multer.File[];

  for (const file of files) {
    const uploadedFile = await uploadOnCloudinary(file.path);

    if (!uploadedFile) {
      throw new ApiError(badRequestErrorClient, "Failed to upload file");
    }

    attachments.push(uploadedFile.url);
  }

  const createdMessage = await ChatMessagesModel.create({
    chat: chat._id,
    sender: sender._id,
    message,
    attachments,
  });

  res.status(resourceCreatedSuccess).json(
    new ApiResponse(
      resourceCreatedSuccess,
      {
        _id: createdMessage._id,
        chat: createdMessage.chat,
        sender: createdMessage.sender,
        message: createdMessage.message,
        attachments: createdMessage.attachments,
        createdAt: createdMessage.createdAt,
      },
      "Message Sent Successfully"
    )
  );
});

//delete message for me
const deleteMessageForMe = TryCatch(async (req, res) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(401, "You are not logged in. Please login to continue");
  }

  const {
    chatMessageId,
  }: {
    chatMessageId?: string;
  } = req.params;

  if (!chatMessageId) {
    throw new ApiError(badRequestErrorClient, "Chat Message ID is required");
  }

  const chatMessage = await ChatMessagesModel.findById(chatMessageId);

  if (!chatMessage) {
    throw new ApiError(notFoundErrorClient, "Chat Message not found");
  }

  if (chatMessage.deletedForWhom.includes(user._id)) {
    throw new ApiError(
      badRequestErrorClient,
      "You have already deleted this message"
    );
  }

  chatMessage.deletedForWhom.push(user._id);

  await chatMessage.save();

  res
    .status(okSuccess)
    .json(new ApiResponse(okSuccess, {}, "Message deleted successfully"));
});

// delete message for everyone
const deleteMessageForEveryOne = TryCatch(async (req, res) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(401, "You are not logged in. Please login to continue");
  }

  const {
    chatMessageId,
  }: {
    chatMessageId?: string;
  } = req.params;

  if (!chatMessageId) {
    throw new ApiError(badRequestErrorClient, "Chat Message ID is required");
  }

  const chatMessage = await ChatMessagesModel.findById(chatMessageId);

  if (!chatMessage) {
    throw new ApiError(notFoundErrorClient, "Chat Message not found");
  }

  if (chatMessage.sender !== user._id) {
    throw new ApiError(
      badRequestErrorClient,
      "You are not the sender of this message"
    );
  }

  if (chatMessage.deletedForEveryone) {
    throw new ApiError(
      badRequestErrorClient,
      "You have already deleted this message"
    );
  }

  chatMessage.deletedForEveryone = true;

  await chatMessage.save();

  res
    .status(okSuccess)
    .json(
      new ApiResponse(
        okSuccess,
        {},
        "Message deleted for everyone successfully"
      )
    );
});

//get messages
const getMessages = TryCatch(async (req, res) => {
  const user = req.user as IUser;

  if (!user) {
    throw new ApiError(unauthorizedErrorClient, "Unauthorized");
  }

  const {
    chatId,
  }: {
    chatId?: string;
  } = req.params;

  if (!chatId) {
    throw new ApiError(badRequestErrorClient, "Chat ID is required");
  }

  const {
    page = 0,
  }: {
    page?: number;
  } = req.body;

  if (!page) {
    throw new ApiError(badRequestErrorClient, "Page number is required");
  }

  const messages = await ChatMessagesModel.find({
    chat: chatId,
    deletedForEveryone: false,
    deletedForWhom: {
      $elemMatch: {
        $ne: user._id,
      },
    },
  })
    .skip(20 * page)
    .limit(20)
    .lean();

  res
    .status(okSuccess)
    .json(
      new ApiResponse(okSuccess, messages, "Messages retrieved successfully")
    );
});

//refetch messages
const refetchMessages = TryCatch(async (req, res) => {
  const user = req.user as IUser;

  const {
    chatId,
  }: {
    chatId?: string;
  } = req.params;

  if (!chatId) {
    throw new ApiError(badRequestErrorClient, "Chat ID is required");
  }

  const newMessage = await ChatMessagesModel.findOne({
    chat: chatId,
  }).lean();

  res
    .status(okSuccess)
    .json(
      new ApiResponse(
        okSuccess,
        newMessage,
        "New message retrieved successfully"
      )
    );
});

export {
  sendMessage,
  deleteMessageForMe,
  deleteMessageForEveryOne,
  getMessages,
  refetchMessages,
};
