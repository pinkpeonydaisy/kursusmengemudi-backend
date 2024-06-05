import { Request, Response, NextFunction } from "express";
import { Instruktur } from "../../../..";
import instruktur from "../../../schema/instruktur";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.params.id;
    const dbquery: Instruktur = await instruktur.findOneAndDelete( { nikInstruktur: queries }, {
      projection: {
        nikInstruktur: true,
        namaLengkap: true,
        alamatInstruktur: true,
        noTelp: true,
        noRekening: true,
        createdAt: true,
        createdBy: true
      }
    } ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery === null ) throw new Error( "The provided NIK is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        nikInstruktur: dbquery.nikInstruktur,
        namaLengkap: dbquery.namaLengkap,
        alamatInstruktur: dbquery.alamatInstruktur,
        noRekening: dbquery.noRekening,
        noTelp: dbquery.noTelp,
        createdAt: dbquery.createdAt,
        createdBy: dbquery.createdBy
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default List;