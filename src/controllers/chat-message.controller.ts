import {
  badRequestErrorClient,
  notFoundErrorClient,
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

  if (!chatId) {
    throw new ApiError(badRequestErrorClient, "Receiver is required");
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

  await ChatMessagesModel.create({
    chat: chat._id,
    sender: sender._id,
    message,
    attachments,
  });

  res.status(resourceCreatedSuccess).json(
    new ApiResponse(
      resourceCreatedSuccess,
      {
        message: message,
        attachments: attachments,
      },
      "Message Sent Successfully"
    )
  );
});

export { sendMessage };
