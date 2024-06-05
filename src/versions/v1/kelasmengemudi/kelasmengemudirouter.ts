import express, { Request, Response } from "express";
import { DefaultResponse } from "../../../..";
import Create from "./create";
import ListArray from "./list";
import ListSingle from "./get";
import Delete from "./delete";
import Update from "./update";
import passport from "passport";
import RoleValidation from "../../../middleware/role";

const kelasmengemudirouter = express.Router();

kelasmengemudirouter.post( "/create", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), Create );
kelasmengemudirouter.get( "/list", ListArray );

kelasmengemudirouter.get( "/list/:id", ListSingle );

kelasmengemudirouter.delete( "/delete/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), Delete );
kelasmengemudirouter.patch( "/update/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), Update );

kelasmengemudirouter.all( "/", ( req: Request, res: Response ) => {
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

export default kelasmengemudirouter;