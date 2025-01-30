import { Router } from "express";
import { signupUser } from "../controllers/user.controller.js";

const user = Router();

user.route("/sign-up").post(signupUser);

export { user };
