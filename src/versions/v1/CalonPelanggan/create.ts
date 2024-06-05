import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../../../..";
import { CreateCalonPelanggan } from "../../../validation/calonpelanggan";
import calonpelanggan from "../../../schema/calonpelanggan";
import { CalonPelanggan } from "../../../..";
import mongoose from "mongoose";
const Create = async ( req: Request, res: Response, next: NextFunction ) => {
  try {
    const validatedBody = CreateCalonPelanggan.validate( req.body );
    if ( validatedBody.error ) throw new Error( validatedBody.error.message );
    const body = validatedBody.value as CalonPelanggan;
    
    const getlatestcalon = await calonpelanggan.find().sort( {
      calonPelangganID: "desc"
    } ).limit( 1 ).catch( () => null);
    if ( getlatestcalon === null ) throw new Error( "Failed to query" );
    
    const currentcalonID: number = getlatestcalon.length === 0 ? 20000 : getlatestcalon[ 0 ]?.calonPelangganID + 1;
    
    const newCalonPelanggan = new calonpelanggan( {
      _id: new mongoose.Types.ObjectId( 1 ),
      calonPelangganID: currentcalonID,
      nama: body.nama,
      kelasPelanggan: body.kelasPelanggan,
      umur: body.umur,
      noWA: body.noWA,
      alamat: body.alamat,
      statusPelanggan: body.statusPelanggan,
      adminKursus: body.adminKursus,
      tanggalPendaftaran: new Date()
    } );
    const write: CalonPelanggan = await newCalonPelanggan.save().catch( ( err ) => err );
    if ( write instanceof Error ) throw write;
    return res.status( 200 ).json( {
      status: 200,
      message: "OK",
      code: "OK",
      valid: true,
      data: write
    } as DefaultResponse );
  } catch ( e ) {
    next( e );
  }
};

export default Create;