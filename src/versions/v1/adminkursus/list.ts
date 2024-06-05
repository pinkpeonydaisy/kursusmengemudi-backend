import { Request, Response, NextFunction } from "express";
import { User } from "../../../..";
import user from "../../../schema/user";
import { DefaultResponse } from "../../../..";
interface AvailableQuery {
  search?: string,
  limit?: number,
  page?: number,
}
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.query as AvailableQuery;
    const search = queries.search || undefined;
    const limit = queries.limit || 10;
    const page = queries.page || 1;

    const databaseQuery = search === undefined || search === "" ? {} : {
      $text: {
        $search: search as string
      }
    };
    const dbquery: User[] = await user.find( databaseQuery ).sort( { created_at: "desc" } ).skip( +limit * ( +page - 1 ) ).limit( +limit ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: dbquery
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default List;