import { Request, Response, NextFunction } from "express";
import { KelasMengemudi } from "../../../..";
import kelasmengemudi from "../../../schema/kelasmengemudi";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const queries = req.params.id;
    const dbquery: KelasMengemudi = await kelasmengemudi.findOneAndDelete( { kelasMengemudiID: queries }, {
      projection: {
        kelasMengemudiID: true,
        namaKelas: true,
        hargaKelas: true,
        jenisKendaraan: true,
        totalJamKursus: true,
        jumlahSesi: true,
        platNomorKendaraan: true,
        namaKendaraan: true,
        createdAt: true,
        createdBy: true
      }
    } ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery === null ) throw new Error( "The provided KelasMengemudiID is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        kelasMengemudiID: dbquery.kelasMengemudiID,
        namaKelas: dbquery.namaKelas,
        hargaKelas: dbquery.hargaKelas,
        jenisKendaraan: dbquery.jenisKendaraan,
        totalJamKursus: dbquery.totalJamKursus,
        jumlahSesi: dbquery.jumlahSesi,
        platNomorKendaraan: dbquery.platNomorKendaraan,
        namaKendaraan: dbquery.namaKendaraan,
        createdAt: dbquery.createdAt,
        createdBy: dbquery.createdBy
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default List;