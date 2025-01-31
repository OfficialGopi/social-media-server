import { Router } from "express";
import {
  autoLogin,
  editUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  signupUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const user = Router();

user.route("/login").post(loginUser);
user.route("/sign-up").post(signupUser);
user.route("/auto-login").post(verifyJWT, autoLogin);
user.route("/refresh-token").post(refreshAccessToken);
user.route("/edit-user").put(verifyJWT, editUser);
user.route("/logout").delete(verifyJWT, logoutUser);

export { user };
