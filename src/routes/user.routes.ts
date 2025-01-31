import { Router } from "express";
import {
  autoLogin,
  loginUser,
  logoutUser,
  refreshAccessToken,
  signupUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const user = Router();

user.route("/sign-up").post(signupUser);
user.route("/").post(loginUser).delete(verifyJWT, logoutUser);
user.route("/refresh-token").post(refreshAccessToken);
user.route("/auto-login").post(verifyJWT, autoLogin);

export { user };
