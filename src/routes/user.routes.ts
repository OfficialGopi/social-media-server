import { Router } from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const user = Router();

user.route("/sign-up").post(signupUser);
user.route("/").post(loginUser).delete(verifyJWT, logoutUser);

export { user };
