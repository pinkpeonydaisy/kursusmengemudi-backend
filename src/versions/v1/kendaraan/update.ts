import { Request, Response, NextFunction } from "express";
import { UpdateKendaraan } from "../../../validation/kendaraan";
import { DefaultResponse, Kendaraan } from "../../../..";
import kendaraan from "../../../schema/kendaraan";
const Update = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const kendaraanid = req.params.id;
    const updateQuery = UpdateKendaraan.validate( req.body );
    if ( updateQuery.error ) throw updateQuery.error;

    const update: Kendaraan = await kendaraan.findOneAndUpdate( {
      nomorKendaraan: kendaraanid
    }, updateQuery.value, {
      upsert: false,
      returnDocument: "after",
      projection: {
        nomorKendaraan: true,
        namaKendaraan: true,
        jenisTransmisi: true,
        jumlahKilometer: true,
        tanggalTerakhirService: true,
        statusKetersediaan: true,
        statusKendaraan: true,
        createdAt: true,
        createdBy: true
      }
    } ).catch( ( err ) => err );
    if ( update instanceof Error ) throw update;
    if ( update === null ) throw new Error( "The provided Nomor Kendaraan is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        nomorKendaraan: update.nomorKendaraan,
        namaKendaraan: update.namaKendaraan,
        jenisTransmisi: update.jenisTransmisi,
        jumlahKilometer: update.jumlahKilometer,
        tanggalTerakhirService: update.tanggalTerakhirService,
        statusKetersediaan: update.statusKetersediaan,
        statusKendaraan: update.statusKendaraan,
        createdAt: update.createdAt,
        createdBy: update.createdBy
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default Update;