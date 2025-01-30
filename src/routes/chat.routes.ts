import { Router } from "express";
import {
  createGroupChat,
  createPersonalChat,
} from "../controllers/chat.controller.js";

const chat = Router();

chat.route("/personal").post(createPersonalChat);
chat.route("/group").post(createGroupChat);

export { chat };
