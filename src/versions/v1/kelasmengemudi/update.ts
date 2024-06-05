import { Request, Response, NextFunction } from "express";
import { UpdateKelasMengemudi } from "../../../validation/kelasmengemudi";
import { DefaultResponse, KelasMengemudi, Kendaraan } from "../../../..";
import kelasmengemudi from "../../../schema/kelasmengemudi";
import kendaraan from "../../../schema/kendaraan";
const Update = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    if ( !req.user ) throw new Error( "Invalid Credentials" );
    const kelasmengemudiid = req.params.id;
    const updateQuery = UpdateKelasMengemudi.validate( req.body );
    if ( updateQuery.error ) throw updateQuery.error;

    if ( ( updateQuery.value as KelasMengemudi ).jumlahSesi ) {
      ( updateQuery.value as KelasMengemudi ).totalJamKursus = ( updateQuery.value as KelasMengemudi ).jumlahSesi * 2;
    }
    
    if ( ( updateQuery.value as KelasMengemudi ).platNomorKendaraan ) {
      const insertedPlatNomorKendaraan = req.body.platNomorKendaraan;
      const dbquery: Kendaraan[] = await kendaraan.find( { nomorKendaraan: insertedPlatNomorKendaraan }, "-_id -__v"  ).catch( err => err );
      if ( dbquery instanceof Error ) throw dbquery;
      if ( dbquery.length === 0 ) throw new Error( "Not Found" );
      updateQuery.value.platNomorKendaraan = dbquery[0].nomorKendaraan;
      updateQuery.value.namaKendaraan = dbquery[0].namaKendaraan;
      updateQuery.value.jenisKendaraan = dbquery[0].jenisTransmisi;
    }

    const update: KelasMengemudi = await kelasmengemudi.findOneAndUpdate( {
      kelasMengemudiID: kelasmengemudiid
    }, updateQuery.value, {
      upsert: false,
      returnDocument: "after",
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
    } ).catch( ( err ) => err );
    if ( update instanceof Error ) throw update;
    if ( update === null ) throw new Error( "The provided kelasMengemudiID is not found on the database" );

    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: {
        kelasMengemudiID: update.kelasMengemudiID,
        namaKelas: update.namaKelas,
        hargaKelas: update.hargaKelas,
        jenisKendaraan: update.jenisKendaraan,
        totalJamKursus: update.totalJamKursus,
        jumlahSesi: update.jumlahSesi,
        platNomorKendaraan: update.platNomorKendaraan,
        namaKendaraan: update.namaKendaraan,
        createdAt: update.createdAt,
        createdBy: update.createdBy
      }
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};
export default Update;
