import { Request, Response, NextFunction } from "express";
import { Instruktur } from "../../../..";
import instruktur from "../../../schema/instruktur";
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
    const dbquery: Instruktur[] = await instruktur.find( databaseQuery, "-_id -__v" ).sort( { createdAt: "desc" } ).skip( +limit * ( +page - 1 ) ).limit( +limit ).catch( err => err );
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