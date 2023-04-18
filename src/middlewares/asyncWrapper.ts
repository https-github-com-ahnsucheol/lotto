// error를 처리하는 asyncWrapper를 만들어서 사용하면 try catch를 사용하지 않아도 된다.
// src/middlewares/asyncWrapper.ts
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/customError/badRequestError";
import { DuplicateKeyError } from "../utils/customError/duplicateKeyError";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncWrapper = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      if (err instanceof BadRequestError || err instanceof DuplicateKeyError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        console.log(err);
        res.status(err.status || 500).json({ message: err.message });
      }
    });
  };
};

export default asyncWrapper;
