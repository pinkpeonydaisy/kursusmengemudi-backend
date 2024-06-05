import { Request, Response, NextFunction } from "express";
import { DefaultResponse, User } from "../../../..";
import { CreateInstruktur } from "../../../validation/instruktur";
import instruktur from "../../../schema/instruktur";
import { Instruktur } from "../../../..";
const Create = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const validatedBody = CreateInstruktur.validate( req.body );
    if ( validatedBody.error ) throw new Error( validatedBody.error.message );
    const body = validatedBody.value as Instruktur;
    const newInstruktur = new instruktur( {
      nikInstruktur: body.nikInstruktur,
      namaLengkap: body.namaLengkap,
      alamatInstruktur: body.alamatInstruktur,
      noTelp: body.noTelp,
      noRekening: body.noRekening,
      createdAt: new Date(),
      createdBy: ( req.user as User ).user_id
    } );
    const write: Instruktur = await newInstruktur.save().catch( ( err ) => err );
    if ( write instanceof Error ) throw write;
    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        nikInstruktur: write.nikInstruktur,
        namaLengkap: write.namaLengkap,
        alamatInstruktur: write.alamatInstruktur,
        noRekening: write.noRekening,
        noTelp: write.noTelp,
        createdAt: write.createdAt,
        createdBy: write.createdBy
      } as Instruktur
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};

export default Create;