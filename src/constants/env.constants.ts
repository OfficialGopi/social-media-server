import dotenv from "dotenv";
dotenv.config();

//environment variables
const port: number = Number(process.env.PORT)!;
const mongoUri: string = process.env.MONGO_URI!;
const mongoDbName: string = process.env.MONGO_DB_NAME!;

const passwordSaltRound: number = Number(process.env.PASSWORD_SALT_ROUND)!;

const jwtSecret: string = process.env.JWT_SECRET!;

const cloudinarySecret: string = process.env.CLOUDINARY_SECRET!;
const cloudinaryKey: string = process.env.CLOUDINARY_KEY!;
const cloudinaryName: string = process.env.CLOUDINARY_NAME!;

const crossOrigin: string = process.env.CROSS_ORIGIN!;

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET!;
const accessTokenExpiry: string = process.env.ACCESS_TOKEN_EXPIRY!;
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET!;
const refreshTokenExpiry: string = process.env.REFRESH_TOKEN_EXPIRY!;

const googleClientId: string = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret: string = process.env.GOOGLE_CLIENT_SECRET!;

export {
  port,
  mongoUri,
  mongoDbName,
  jwtSecret,
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
  crossOrigin,
  passwordSaltRound,
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiry,
  refreshTokenExpiry,
  googleClientId,
  googleClientSecret,
};
