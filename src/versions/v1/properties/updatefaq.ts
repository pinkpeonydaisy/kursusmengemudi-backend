import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../../../..";
import { redisClient } from "../../..";
import { UpdateFaq } from "../../../validation/property";

const Set = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const index = req.params.index;

    const getcurrent: {
      question: string,
      answer: string
    }[] = await redisClient.get( "faq" ).then( response => {
      if ( response === null ) return [];
      return JSON.parse( response );
    } ).catch( err => err );
    if ( getcurrent instanceof Error ) throw getcurrent;

    if ( getcurrent[ parseInt( index ) ] === undefined ) throw new Error( "Faq tidak ditemukan" );
    const body = UpdateFaq.validate( req.body );
    if ( body.error ) throw new Error( body.error.message );
    const question = body.value.question;
    const answer = body.value.answer;
    if ( question !== undefined ) {
      getcurrent[ parseInt( index ) ].question = question;
    }
    if ( answer !== undefined ) {
      getcurrent[ parseInt( index ) ].answer = answer;
    }
    if ( question !== undefined && answer !== undefined ) {
      getcurrent[ parseInt( index ) ] = { question, answer };
    }


    const save = await redisClient.set( "faq", JSON.stringify( getcurrent ) ).catch( err => err );
    if ( save instanceof Error ) throw save;

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        question: getcurrent[ parseInt( index ) ].question,
        answer: getcurrent[ parseInt( index ) ].answer
      }
    } as DefaultResponse );

  } catch ( e ) {
    next( e );
  }
};
export default Set;