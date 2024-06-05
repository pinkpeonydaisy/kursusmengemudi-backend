import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../../../..";
import { redisClient } from "../../..";

const Set = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const index = req.params.index;
    const current = await redisClient.get( "faq" ).then( response => {
      if ( response === null ) return [];
      return JSON.parse( response );
    } ).catch( err => err );
    if ( current instanceof Error ) throw current;

    if ( current[ parseInt( index ) ] === undefined ) throw new Error( "Faq tidak ditemukan" );

    const deletedFaq = current[ parseInt( index ) ];

    if ( current[ parseInt( index ) ] !== undefined ) {
      current.splice( index, 1 );
    }

    const save = await redisClient.set( "faq", JSON.stringify( current ) ).catch( err => err );
    if ( save instanceof Error ) throw save;


    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        question: deletedFaq.question,
        answer: deletedFaq.answer
      }
    } as DefaultResponse );

  } catch ( e ) {
    next( e );
  }
};
export default Set;
