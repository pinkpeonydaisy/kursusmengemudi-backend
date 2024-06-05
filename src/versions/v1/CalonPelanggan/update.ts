import { Request, Response, NextFunction } from "express";
import { UpdateCalonPelanggan } from "../../../validation/calonpelanggan";
import { CalonPelanggan, DefaultResponse } from "../../../..";
import calonpelanggan from "../../../schema/calonpelanggan";
const Update = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const calonpelangganid = req.params.id;
    const updateQuery = UpdateCalonPelanggan.validate( req.body );
    if ( updateQuery.error ) throw updateQuery.error;

    const update: CalonPelanggan = await calonpelanggan.findOneAndUpdate( {
      calonPelangganID: calonpelangganid
    }, updateQuery.value, {
      upsert: false,
      returnDocument: "after",
      projection: {
        calonPelangganID: true,
        nama: true,
        kelasPelanggan: true,
        umur: true,
        noWA: true,
        alamat: true,
        statusPelanggan: true,
        adminKursus: true,
        tanggalPendaftaran: true
      }
    } ).catch( ( err ) => err );
    if ( update instanceof Error ) throw update;
    if ( update === null ) throw new Error( "The provided calonPelangganID is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: update
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default Update;