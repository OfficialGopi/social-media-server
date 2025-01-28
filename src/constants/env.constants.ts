import dotenv from "dotenv";
dotenv.config();

//environment variables
const port: number = Number(process.env.PORT) || 3000;
const mongoUri: string = process.env.MONGO_URI || "";
const mongoDbName: string =
  process.env.MONGO_DB_NAME || "college-management-system-gcelt";

const passwordSalt: string = process.env.PASSWORD_SALT || "Gopi2004";

const jwtSecret: string = process.env.JWT_SECRET || "";

const cloudinarySecret: string = process.env.CLOUDINARY_SECRET || "";
const cloudinaryKey: string = process.env.CLOUDINARY_KEY || "";
const cloudinaryName: string = process.env.CLOUDINARY_NAME || "";

const crossOrigin: string = process.env.CROSS_ORIGIN || "http://localhost:5173";

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";
const accessTokenExpiry: string = process.env.ACCESS_TOKEN_EXPIRY || "28d";
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "";
const refreshTokenExpiry: string = process.env.REFRESH_TOKEN_EXPIRY || "365d";

export {
  port,
  mongoUri,
  mongoDbName,
  jwtSecret,
  cloudinaryName,
  cloudinaryKey,
  cloudinarySecret,
  crossOrigin,
  passwordSalt,
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiry,
  refreshTokenExpiry,
};
