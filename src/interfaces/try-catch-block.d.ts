import { NextFunction, Request, Response } from "express";

export type TryCatchBlockFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>> | void>;
