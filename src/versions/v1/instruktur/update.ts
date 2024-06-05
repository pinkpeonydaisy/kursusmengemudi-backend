import { Request, Response, NextFunction } from "express";
import { UpdateInstruktur } from "../../../validation/instruktur";
import { DefaultResponse, Instruktur } from "../../../..";
import instruktur from "../../../schema/instruktur";
const Update = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const instrukturid = req.params.id;
    const updateQuery = UpdateInstruktur.validate( req.body );
    if ( updateQuery.error ) throw updateQuery.error;

    const update: Instruktur = await instruktur.findOneAndUpdate( {
      nikInstruktur: instrukturid
    }, updateQuery.value, {
      upsert: false,
      returnDocument: "after",
      projection: {
        nikInstruktur: true,
        namaLengkap: true,
        alamatInstruktur: true,
        noTelp: true,
        noRekening: true,
        createdAt: true,
        createdBy: true
      }
    } ).catch( ( err ) => err );
    if ( update instanceof Error ) throw update;
    if ( update === null ) throw new Error( "The provided NIK is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        nikInstruktur: update.nikInstruktur,
        namaLengkap: update.namaLengkap,
        alamatInstruktur: update.alamatInstruktur,
        noRekening: update.noRekening,
        noTelp: update.noTelp,
        createdAt: update.createdAt,
        createdBy: update.createdBy
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default Update;