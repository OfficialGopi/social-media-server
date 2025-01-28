import { ApiError } from "../utils/api.error.ts";

type typeAccessTokenAndRefreshTokenGenerateAndSave = (
  userId: string
) => Promise<{
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
  message?: string;
}>;

export { typeAccessTokenAndRefreshTokenGenerateAndSave };
