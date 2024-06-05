import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { createAdminKursus } from "../../../validation/admin";
import { DefaultResponse, User } from "../../../..";
import user from "../../../schema/user";
const CreateAdminKursus = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const bodyValidated = createAdminKursus.validate( req.body );
    if ( bodyValidated.error ) throw new Error( bodyValidated.error.message );

    const existQuery: User[] | null = await user.find( {
      username: bodyValidated.value.username
    } ).catch( () => null );
    if ( existQuery === null ) throw new Error( "Failed to query MongoDB" );
    if ( existQuery.length !== 0 ) throw new Error( "Username already exists" );
    const passwordHash = await new Promise( ( resolve, reject ) => {
      bcrypt.hash( bodyValidated.value.password, 8, ( err, hash ) => {
        if ( err !== undefined ) reject( null );
        resolve( hash );
      } );
    } );
    if ( passwordHash === null ) throw new Error( "Failed hashing" );
    const getlatestuser = await user.find().sort( {
      user_id: "desc"
    } ).limit( 1 ).catch( () => null );
    if ( getlatestuser === null ) throw new Error( "Failed to query" );

    const currentUserId: number = getlatestuser.length === 0 ? 10000 : getlatestuser[ 0 ]?.user_id + 1;

    const writeNewUser = await user.create( {
      user_id: currentUserId,
      username: bodyValidated.value.username,
      tipe_user: "ADMIN",
      password_hash: passwordHash,
      created_by: ( req.user as User ).user_id,
      created_at: new Date(),
    } ).catch( ( err ) => err );
    if ( writeNewUser instanceof Error ) throw writeNewUser;
    return res.status( 200 ).json( {
      message: "OK",
      code: "OK",
      status: 200,
      valid: true,
      data:  {
        user_id: writeNewUser.user_id,
        username: writeNewUser.username,
        password_hash: writeNewUser.password_hash,
        tipe_user: writeNewUser.tipe_user,
        created_at: writeNewUser.created_at,
        created_by: writeNewUser.created_by
      }
    } as DefaultResponse );

  } catch ( e ) {
    next( e );
  }
};
export default CreateAdminKursus;