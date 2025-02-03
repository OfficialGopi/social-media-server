import { Router } from "express";
import {
  createGroupChat,
  createPersonalChat,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage } from "../controllers/chat-message.controller.js";

const chat = Router();

chat.route("/personal").post(createPersonalChat);
chat.route("/group").post(createGroupChat);

chat.route("/send-message").post(verifyJWT, sendMessage);

export { chat };
