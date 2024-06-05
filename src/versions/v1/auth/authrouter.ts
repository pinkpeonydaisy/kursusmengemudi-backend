import express, { Request, Response } from "express";
import { DefaultResponse } from "../../../../";
import Login from "./login";
import Verify from "./verify";

const authrouter = express.Router();

// authrouter.post( "/register", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), CreateUser );
authrouter.post( "/login", Login );
authrouter.get( "/verify/:token", Verify );
authrouter.all( "/", ( req: Request, res: Response ) => {
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

export default authrouter;