import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { followOrUnfollow } from "../controllers/follower.controller.js";

const follow = Router();

follow.route("/follow-or-unfollow").post(verifyJWT, followOrUnfollow);

export { follow };
