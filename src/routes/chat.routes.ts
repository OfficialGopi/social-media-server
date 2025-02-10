import { Router } from "express";
import {
  createGroupChat,
  createPersonalChat,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteMessageForEveryOne,
  deleteMessageForMe,
  sendMessage,
} from "../controllers/chat-message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const chat = Router();

chat.route("/personal").post(verifyJWT, createPersonalChat);
chat.route("/group").post(verifyJWT, createGroupChat);
chat
  .route("/send-message")
  .post(upload.array("attachments", 10), verifyJWT, sendMessage);

chat.route("/:chatMessageId").delete(verifyJWT, deleteMessageForMe);
chat.route("/e/:chatMessageId").delete(verifyJWT, deleteMessageForEveryOne);

export { chat };
