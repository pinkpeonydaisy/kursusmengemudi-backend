import { Request, Response, NextFunction } from "express";
import { Kendaraan } from "../../../..";
import kendaraan from "../../../schema/kendaraan";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.params.id;
    const dbquery: Kendaraan[] = await kendaraan.find( { nomorKendaraan: queries }, "-_id -__v" ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery.length === 0 ) throw new Error( "Not Found" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: dbquery[ 0 ]
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default List;