import { Request, Response } from "express";
import { DefaultResponse } from "../..";
export default (
  req: Request,
  res: Response,
) => {
  return res.status( 404 ).json( {
    message: "Path not found",
    status: 404,
    code: "INVALIDREQUEST",
    valid: false,
    data: {
      path: req.originalUrl,
    },
  } as DefaultResponse );
};