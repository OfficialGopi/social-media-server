import express from "express";
import cors from "cors";
import passport from "passport";
import { GoogleStrategy } from "./utils/google.oauth-2.config.js";
import session from "express-session";
import { createServer } from "http";
import {
  crossOrigin,
  googleClientId,
  googleClientSecret,
} from "./constants/env.constants.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

const httpServer = createServer(app);

app.use(
  cors({
    origin: crossOrigin,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import {
//   badRequestErrorClient,
//   okSuccess,
// } from "./constants/statusCode.constant.js";
// import { ApiResponse } from "./utils/api.response.js";

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: googleClientId,
//       clientSecret: googleClientSecret,
//       callbackURL: "http://localhost:8000/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user: any, done) => {
//   done(null, user);
// });

// //auth
// app.use(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email", "openid"],
//   })
// );

// app.use(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/auth/google/failure",
//   }),
//   (req, res) => {
//     res.redirect("/auth/google/success");
//   }
// );

// app.get("/auth/google/failure", (req, res) => {
//   console.log("In failure");
//   console.table(req.user);
//   res
//     .status(badRequestErrorClient)
//     .json(new ApiResponse(badRequestErrorClient, "Authentication failed"));
// });

// app.get("/auth/google/success", (req, res) => {
//   console.log("In Success");
//   console.table(req.user);
//   res
//     .status(okSuccess)
//     .json(
//       new ApiResponse(okSuccess, req.user, "Google authentication successful")
//     );
// });

import { v1 } from "./versions/v1.version.js";

app.use("/api/v1", v1);

app.use(errorMiddleware);

export { httpServer };
