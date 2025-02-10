import { Router } from "express";
import {
  createGroupChat,
  createPersonalChat,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteMessageForEveryOne,
  deleteMessageForMe,
  getMessages,
  refetchMessages,
  sendMessage,
} from "../controllers/chat-message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const chat = Router();

//create chat
chat.route("/personal").post(verifyJWT, createPersonalChat);
chat.route("/group").post(verifyJWT, createGroupChat);

//send message
chat
  .route("/send-message")
  .post(upload.array("attachments", 10), verifyJWT, sendMessage);

//delete message
chat.route("/:chatMessageId").delete(verifyJWT, deleteMessageForMe);
chat.route("/e/:chatMessageId").delete(verifyJWT, deleteMessageForEveryOne);

//get message
chat.route("/c/get/:chatId").post(verifyJWT, getMessages);
chat.route("/c/refetch-message/:chatId").post(verifyJWT, refetchMessages);

export { chat };
