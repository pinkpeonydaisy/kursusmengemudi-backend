import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

import { Login } from "../../../validation/auth";
import { DefaultResponse, User } from "../../../..";
import user from "../../../schema/user";
const CreateUser = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const bodyValidated = Login.validate( req.body );
    if ( bodyValidated.error ) throw new Error( bodyValidated.error.message );

    const findUser: User[] | null = await user.find( { username: bodyValidated.value.username } ).catch( () => null );
    if ( findUser === null ) throw new Error( "Failed to query database" );
    if ( findUser.length === 0 ) throw new Error( "Invalid Credentials" );
    const userData: User = findUser[ 0 ];
    const compareHash = await new Promise( ( resolve, reject ) => {
      bcrypt.compare( bodyValidated.value.password, userData.password_hash, ( err, result ) => {
        if ( err ) reject( null );
        resolve( result );
      } );
    } );
    if ( compareHash === null ) throw new Error( "Failed to compare hashses" );
    if ( compareHash === false ) throw new Error( "Invalid Credentials" );

    //If the credentials are correct... do
    const jwtString = await new SignJWT( {
      user_id: userData.user_id,
      username: userData.username,
      tipe_user: userData.tipe_user
    } )
      .setProtectedHeader( { alg: "HS256", typ: "JWT" } )
      .setAudience( process.env.JWT_AUDIENCE as string )
      //Change this for expiration time
      .setExpirationTime( "1w" )
      .setIssuedAt()
      .setIssuer( process.env.JWT_ISSUER as string )
      //Better to store jwt key in a key management service like aws
      .sign( Buffer.from( process.env.JWT_KEY as string, "base64" ) )
      .catch( () => null );
    if ( jwtString === null ) throw new Error( "Failed to create token" );

    return res.status( 200 ).json( {
      message: "OK",
      code: "OK",
      status: 200,
      valid: true,
      data: {
        type: "Bearer",
        token: jwtString
      }
    } as DefaultResponse );

  } catch ( e ) {
    next( e );
  }
};
export default CreateUser;