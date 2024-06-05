import { Request, Response, NextFunction } from "express";
import { KelasMengemudi } from "../../../..";
import kelasmengemudi from "../../../schema/kelasmengemudi";
import kendaraan from "../../../schema/kendaraan";
import { DefaultResponse } from "../../../..";
const List = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const queries = req.params.id;
    const dbquery: KelasMengemudi[] = await kelasmengemudi.find( { kelasMengemudiID: queries }, "-_id -__v"  ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery.length === 0 ) throw new Error( "Not Found" );
    
    const kendaraanQuery = await kendaraan.find( { nomorKendaraan: dbquery[0].platNomorKendaraan } ).catch( err => err);
    if ( kendaraanQuery instanceof Error ) throw kendaraanQuery;
    dbquery[0].platNomorKendaraan = kendaraanQuery[0].nomorKendaraan;
    dbquery[0].namaKendaraan = kendaraanQuery[0].namaKendaraan;
    dbquery[0].jenisKendaraan = kendaraanQuery[0].jenisTransmisi;

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