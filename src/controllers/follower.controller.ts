import {
  badRequestErrorClient,
  resourceCreatedSuccess,
} from "../constants/statusCode.constant.js";
import { IUser } from "../interfaces/models.js";
import { FollowersModel } from "../models/followers.model.js";
import { UserModel } from "../models/user.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

const followOrUnfollow = TryCatch(async (req, res, _) => {
  const user = req.user as unknown as IUser;

  if (!user) {
    throw new ApiError(
      badRequestErrorClient,
      "You must be logged in to follow or unfollow a user."
    );
  }

  const {
    following,
  }: {
    following?: string;
  } = req.params;

  if (!following) {
    throw new ApiError(
      badRequestErrorClient,
      "You must provide the user to follow or unfollow."
    );
  }

  const userToFollow = await UserModel.findById(following);

  if (!userToFollow) {
    throw new ApiError(badRequestErrorClient, "User not found.");
  }

  const followExists = await FollowersModel.findOne({
    follower: user._id,
    following: userToFollow._id,
  });

  if (followExists) {
    await followExists.deleteOne();
  } else {
    await FollowersModel.create({
      follower: user._id,
      following: userToFollow._id,
    });
  }

  res
    .status(resourceCreatedSuccess)
    .json(
      new ApiResponse(
        resourceCreatedSuccess,
        "Follow or unfollow user successfully."
      )
    );
});

export { followOrUnfollow };
