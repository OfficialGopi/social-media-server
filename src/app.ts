import express from "express";
import cors from "cors";

import { crossOrigin } from "./constants/env.constants.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createServer } from "http";

const app = express();

const httpServer = createServer(app);

app.use(
  cors({
    origin: crossOrigin,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

import { v1 } from "./versions/v1.routes.js";

app.use("/api/v1", v1);
app.use(errorMiddleware);

export { httpServer };
