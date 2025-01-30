import { Router } from "express";
import { user } from "../routes/user.routes.js";
import { chat } from "../routes/chat.routes.js";

const v1 = Router();

v1.use("/user", user);
v1.use("/chat", chat);

export { v1 };
