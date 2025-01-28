import { NextFunction, Request, Response } from "express";
import { TryCatchBlockFunctionType } from "../interfaces/try-catch-block.js";

const TryCatch =
  (fn: TryCatchBlockFunctionType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
export { TryCatch };
