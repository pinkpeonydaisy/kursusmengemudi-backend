import { Request, Response, NextFunction } from "express";
import { Kendaraan } from "../../../..";
import kendaraan from "../../../schema/kendaraan";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.params.id;
    const dbquery: Kendaraan = await kendaraan.findOneAndDelete( { nomorKendaraan: queries }, {
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
    } ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery === null ) throw new Error( "The provided Nomor Kendaraan is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        nomorKendaraan: dbquery.nomorKendaraan,
        namaKendaraan: dbquery.namaKendaraan,
        jenisTransmisi: dbquery.jenisTransmisi,
        jumlahKilometer: dbquery.jumlahKilometer,
        tanggalTerakhirService: dbquery.tanggalTerakhirService,
        statusKetersediaan: dbquery.statusKetersediaan,
        statusKendaraan: dbquery.statusKendaraan,
        createdAt: dbquery.createdAt,
        createdBy: dbquery.createdBy
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default List;