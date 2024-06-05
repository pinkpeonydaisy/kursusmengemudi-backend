import express, { Request, Response } from "express";
import { DefaultResponse } from "../../../..";
import passport from "passport";
import RoleValidation from "../../../middleware/role";
import SetDescription from "./setdescription";
import AddFaq from "./addfaq";
import UpdateFaq from "./updatefaq";
import GetInfo from "./getinfo";
import DeleteFaq from "./deletefaq";

const propertyRouter = express.Router();


propertyRouter.patch( "/description", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), SetDescription );
propertyRouter.patch( "/faq/update/:index", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), UpdateFaq );
propertyRouter.put( "/faq", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), AddFaq );
propertyRouter.get( "/", GetInfo );
propertyRouter.delete( "/faq/delete/:index", passport.authenticate( "bearer", { session: false } ), RoleValidation( "OWNER" ), DeleteFaq );

propertyRouter.all( "/", ( req: Request, res: Response ) => {
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

export default propertyRouter;
