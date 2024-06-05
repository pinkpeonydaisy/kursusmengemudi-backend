import { Request, Response, NextFunction } from "express";
import { CalonPelanggan } from "../../../..";
import calonpelanggan from "../../../schema/calonpelanggan";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.params.id;
    const dbquery: CalonPelanggan[] = await calonpelanggan.findOneAndDelete( { calonPelangganID: queries }, {
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
    } ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery === null ) throw new Error( "Not Found" );

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