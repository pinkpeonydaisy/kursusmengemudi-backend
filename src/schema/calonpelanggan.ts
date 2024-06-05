import mongoose from "mongoose";
import { CalonPelanggan } from "../..";
const stringRequired = {
  type: String,
  required: true
};
const CalonPelangganSchema = new mongoose.Schema<CalonPelanggan>( {
  calonPelangganID: {
    type: Number,
    required: true,
    unique: true
  },
  nama: stringRequired,
  kelasPelanggan: {
    type: Number,
    required: false
  },
  umur: {
    type: Number,
    required: true
  },
  noWA: {
    type: String,
    required: true,
    unique: true
  },
  alamat: stringRequired,
  statusPelanggan: {
    type: String,
    required: true,
    enum: [ "Calon", "Siswa", "Lulus" ]
  },
  adminKursus: {
    type: Number,
    required: false
  },
  tanggalPendaftaran: {
    type: Date,
    required: true
  }
}, {
  strict: true,
} );

CalonPelangganSchema.index( {
  calonPelangganID: 1,
  nama: "text",
  kelasPelanggan: 1,
  umur: 1,
  noWA: "text",
  alamat: "text",
  adminKursus: 1,
  statusPelanggan: "text",
  tanggalPendaftaran: "text",
}, {
  name: "default"
} );
export default mongoose.model( "calonpelanggan_data", CalonPelangganSchema );