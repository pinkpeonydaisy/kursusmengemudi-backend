import { Strategy } from "passport-http-bearer";
import { jwtVerify } from "jose";
import userDatabase from "../schema/user";
export default new Strategy( async ( bearer: string, done ) => {
  try {
    const { payload, protectedHeader } = await jwtVerify(
      bearer,
      Buffer.from( process.env.JWT_KEY as string, "base64" ),
      {
        maxTokenAge: "1 week",
        issuer: process.env.JWT_ISSUER as string,
        currentDate: new Date(),
        requiredClaims: [ "user_id", "username", "tipe_user", "iss", "aud", "exp", "iat" ],
        audience: process.env.JWT_AUDIENCE,
        algorithms: [ "HS256" ],
        typ: "JWT",
      }
    ).catch( ( err ) => {
      return { payload: null, protectedHeader: ( err as Error ).message };
    } );
    if ( payload === null ) throw new Error( protectedHeader );
    const queryDB = await userDatabase
      .find(
        {
          user_id: payload.user_id,
          username: payload.username,
          tipe_user: payload.tipe_user
        },
        "-password_hash"
      )
      .catch( () => null );
    if ( queryDB === null ) throw new Error( "Failed to query" );
    if ( queryDB.length === 0 ) throw new Error( "Invalid Credentials" );
    return done( null, queryDB[ 0 ] );
  } catch ( e ) {
    return done( e, false );
  }
} );