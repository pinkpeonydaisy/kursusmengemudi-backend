import { Request, Response, NextFunction } from "express";
import { User } from "../../../..";
import user from "../../../schema/user";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.params.id;
    if (parseInt(queries, 10) === 10000) throw new Error ("This User cannot be deleted" );
    const dbquery: User = await user.findOneAndDelete( { user_id: queries }, {
      projection: {
        user_id: true,
        username: true,
        password_hash: true,
        tipe_user: true,
        created_at: true,
        created_by: true
      }
    } ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery === null ) throw new Error( "The provided user_id is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        user_id: dbquery.user_id,
        username: dbquery.username,
        password_hash: dbquery.password_hash,
        tipe_user: dbquery.tipe_user,
        created_at: dbquery.created_at,
        created_by: dbquery.created_by
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default List;