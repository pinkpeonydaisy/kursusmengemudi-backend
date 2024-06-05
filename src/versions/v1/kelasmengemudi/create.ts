import { Request, Response, NextFunction } from "express";
import { DefaultResponse, User, Kendaraan } from "../../../..";
import { CreateKelasMengemudi } from "../../../validation/kelasmengemudi";
import kelasmengemudi from "../../../schema/kelasmengemudi";
import kendaraan from "../../../schema/kendaraan";
import { KelasMengemudi } from "../../../..";
const Create = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const validatedBody = CreateKelasMengemudi.validate( req.body );
    if ( validatedBody.error ) throw new Error( validatedBody.error.message );
    const body = validatedBody.value as KelasMengemudi;

    const getlatestkelasmengemudi = await kelasmengemudi.find().sort( {
      kelasMengemudiID: "desc"
    } ).limit( 1 ).catch( () => null);
    if ( getlatestkelasmengemudi === null ) throw new Error( "Failed to query" );
    
    const currentkelasmengemudiID: number = getlatestkelasmengemudi.length === 0 ? 30000 : getlatestkelasmengemudi[ 0 ]?.kelasMengemudiID + 1;

    const insertedPlatNomorKendaraan = req.body.platNomorKendaraan;
    const dbquery: Kendaraan[] = await kendaraan.find( { nomorKendaraan: insertedPlatNomorKendaraan }, "-_id -__v"  ).catch( err => err );
    if ( dbquery instanceof Error ) throw dbquery;
    if ( dbquery.length === 0 ) throw new Error( "Not Found" );
    
    const newKelasMengemudi = new kelasmengemudi( {
      kelasMengemudiID: currentkelasmengemudiID,
      namaKelas: body.namaKelas,
      hargaKelas: body.hargaKelas,
      jenisKendaraan: dbquery[0].jenisTransmisi,
      totalJamKursus: body.jumlahSesi*2,
      jumlahSesi: body.jumlahSesi,
      platNomorKendaraan: body.platNomorKendaraan,
      namaKendaraan: dbquery[0].namaKendaraan,
      createdAt: new Date(),
      createdBy: ( req.user as User ).user_id
    } );
    const write: KelasMengemudi = await newKelasMengemudi.save().catch( ( err ) => err );
    if ( write instanceof Error ) throw write;
    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        kelasMengemudiID: write.kelasMengemudiID,
        namaKelas: write.namaKelas,
        hargaKelas: write.hargaKelas,
        jenisKendaraan: write.jenisKendaraan,
        totalJamKursus: write.totalJamKursus,
        jumlahSesi: write.jumlahSesi,
        platNomorKendaraan: write.platNomorKendaraan,
        namaKendaraan: write.namaKendaraan,
        createdAt: write.createdAt,
        createdBy: write.createdBy
      } as KelasMengemudi
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default Create;