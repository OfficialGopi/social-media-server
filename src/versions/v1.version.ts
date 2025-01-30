import { Router } from "express";
import { user } from "../routes/user.routes.js";

const v1 = Router();

v1.use("/user", user);

export { v1 };
