import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { follow, unfollow } from "../controllers/follower.controller.js";

const follower = Router();

follower.route("/follow/:following").post(verifyJWT, follow);
follower.route("/unfollow/:following").post(verifyJWT, unfollow);

export { follower };
