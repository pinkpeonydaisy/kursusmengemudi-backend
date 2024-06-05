import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../../../..";
import { redisClient } from "../../..";

const GetInfo = async ( _req: Request, res: Response, next: NextFunction ) => {
  try {
    const faqInfo = await redisClient.get( "faq" ).then( response => {
      if ( response === null ) return [];
      return JSON.parse( response );
    } ).catch( err => err );
    if ( faqInfo instanceof Error ) throw faqInfo;

    const description = await redisClient.get( "description" ).then( response => {
      if ( response === null ) return "";
      return response;
    } ).catch( err => err );
    if ( description instanceof Error ) throw description;

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        description,
        faq: faqInfo
      }
    } as DefaultResponse );

  } catch ( e ) {
    next( e );
  }
};
export default GetInfo;