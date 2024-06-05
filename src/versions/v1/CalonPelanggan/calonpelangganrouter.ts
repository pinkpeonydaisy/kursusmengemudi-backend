import express, { Request, Response } from "express";
import { DefaultResponse } from "../../../..";
import Create from "./create";
import ListArray from "./list";
import ListSingle from "./get";
import Delete from "./delete";
import Update from "./update";
import passport from "passport";
import RoleValidation from "../../../middleware/role";

const calonpelangganrouter = express.Router();

calonpelangganrouter.post( "/create", Create );
calonpelangganrouter.get( "/list", passport.authenticate( "bearer", { session: false } ), RoleValidation( "ADMIN" ), ListArray );

calonpelangganrouter.get( "/list/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "ADMIN" ), ListSingle );

calonpelangganrouter.delete( "/delete/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "ADMIN" ), Delete );
calonpelangganrouter.patch( "/update/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "ADMIN" ), Update );

calonpelangganrouter.all( "/", ( req: Request, res: Response ) => {
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

export default calonpelangganrouter;