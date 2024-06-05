import { Request, Response, NextFunction } from "express";
import { DefaultResponse, User } from "../../../..";
import { CreateKendaraan } from "../../../validation/kendaraan";
import kendaraan from "../../../schema/kendaraan";
import { Kendaraan } from "../../../..";
const Create = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const validatedBody = CreateKendaraan.validate( req.body );
    if ( validatedBody.error ) throw new Error( validatedBody.error.message );
    const body = validatedBody.value as Kendaraan;
    const newKendaraan = new kendaraan( {
      nomorKendaraan: body.nomorKendaraan,
      namaKendaraan: body.namaKendaraan,
      jenisTransmisi: body.jenisTransmisi,
      jumlahKilometer: body.jumlahKilometer,
      tanggalTerakhirService: body.tanggalTerakhirService,
      statusKetersediaan: body.statusKetersediaan,
      statusKendaraan: body.statusKendaraan,
      createdAt: new Date(),
      createdBy: ( req.user as User ).user_id
    } );
    const write: Kendaraan = await newKendaraan.save().catch( ( err ) => err );
    if ( write instanceof Error ) throw write;
    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        nomorKendaraan: write.nomorKendaraan,
        namaKendaraan: write.namaKendaraan,
        jenisTransmisi: write.jenisTransmisi,
        jumlahKilometer: write.jumlahKilometer,
        tanggalTerakhirService: write.tanggalTerakhirService,
        statusKetersediaan: write.statusKetersediaan,
        statusKendaraan: write.statusKendaraan,
        createdAt: write.createdAt,
        createdBy: write.createdBy
      } as Kendaraan
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};

export default Create;