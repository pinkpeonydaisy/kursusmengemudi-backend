import express, { Request, Response } from "express";
import { DefaultResponse } from "../../../..";
import Create from "./create";
import ListArray from "./list";
import ListSingle from "./get";
import Delete from "./delete";
import Update from "./update";
import passport from "passport";
import RoleValidation from "../../../middleware/role";

const kendaraanRouter = express.Router();

kendaraanRouter.post( "/create", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), Create );
kendaraanRouter.get( "/list", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), ListArray );

kendaraanRouter.get( "/list/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), ListSingle );

kendaraanRouter.delete( "/delete/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), Delete );
kendaraanRouter.patch( "/update/:id", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), Update );

kendaraanRouter.all( "/", ( req: Request, res: Response ) => {
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

export default kendaraanRouter;