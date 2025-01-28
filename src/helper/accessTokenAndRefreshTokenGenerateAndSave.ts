import {
  internalServerError,
  notFoundErrorClient,
  okSuccess,
} from "../constants/statusCode.constant.js";
import { typeAccessTokenAndRefreshTokenGenerateAndSave } from "../interfaces/helper.js";
import { UserModel } from "../models/user.model.js";

const accessTokenAndRefreshTokenGenerateAndSave: typeAccessTokenAndRefreshTokenGenerateAndSave =
  async (user) => {
    try {
      const userData = await UserModel.findById(user);

      if (!userData) {
        return {
          success: false,
          status: notFoundErrorClient,
          message: "User Not Found",
        };
      }

      const accessToken = userData.generateAccessToken();
      const refreshToken = userData.generateRefreshToken();

      userData.refreshToken = refreshToken;

      await userData.save();

      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
        status: okSuccess,
      };
    } catch (error) {
      return {
        success: false,
        status: internalServerError,
        message: "Internal Server Error",
      };
    }
  };

export { accessTokenAndRefreshTokenGenerateAndSave };
