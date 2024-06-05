import express, { Request, Response } from "express";
import { DefaultResponse } from "../..";
import v1 from "./v1/router";
const versionRouter = express.Router();
versionRouter.use( "/v1", v1 );
versionRouter.all( "/", ( req: Request, res: Response ) => {
  return res.status( 200 ).json( {
    status: 200,
    valid: true,
    code: "OK",
    message: "OK",
    data: {
      path: req.baseUrl,
      source: req.ip,
      hostname: req.hostname,
      time: new Date(),
    },
  } as DefaultResponse );
} );


export default versionRouter;