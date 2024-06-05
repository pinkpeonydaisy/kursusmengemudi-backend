import { Request, Response, NextFunction } from "express";
import { User } from "../..";
const RoleValidation = ( tipe_user: "OWNER" | "ADMIN" ) => {
  return async ( req: Request, _res: Response, next: NextFunction ) => {
    try {
      const user = req.user as User;
      if ( user === undefined || user === null ) throw new Error( "Unauthorized Access" );
      if ( user.tipe_user === "OWNER" && tipe_user === "OWNER") return next();
      if ( user.tipe_user === "ADMIN" && tipe_user === "ADMIN") return next();
      throw new Error("Unauthorized User");

    } catch ( err ) {
      next( err );
    }
  };
};

export default RoleValidation;