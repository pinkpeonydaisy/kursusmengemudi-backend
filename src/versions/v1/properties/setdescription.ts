import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../../../..";
import { redisClient } from "../../..";
import { Description } from "../../../validation/property";

const Set = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const body = Description.validate( req.body );
    if ( body.error ) throw new Error( body.error.message );
    const description = body.value.description;


    const save = await redisClient.set( "description", description ).catch( err => err );
    if ( save instanceof Error ) throw save;


    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: { description }
    } as DefaultResponse );

  } catch ( e ) {
    next( e );
  }
};
export default Set;