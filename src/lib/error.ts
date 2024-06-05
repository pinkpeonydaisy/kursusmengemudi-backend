import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../..";
export default (
  err: Error,
  req: Request,
  res: Response,
  //eslint-disable-next-line
  next: NextFunction
) => {
  return res.status( 400 ).json( {
    message: err.message,
    status: 400,
    code: "INVALIDREQUEST",
    valid: false,
    data: {
      path: req.originalUrl,
      error: err
    },
  } as DefaultResponse );
};