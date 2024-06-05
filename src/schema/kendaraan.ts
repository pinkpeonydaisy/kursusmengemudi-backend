import mongoose from "mongoose";
import { Kendaraan } from "../..";
const stringRequired = {
  type: String,
  required: true
};
const KendaraanSchema = new mongoose.Schema<Kendaraan>( {
  nomorKendaraan: {
    type: String,
    required: true,
    unique: true
  },
  namaKendaraan: stringRequired,
  jenisTransmisi: {
    type: String,
    required: true,
    enum: [ "MATIC", "MANUAL" ]
  },
  jumlahKilometer: {
    type: Number,
    required: true
  },
  tanggalTerakhirService: {
    type: Date,
    required: true
  },
  statusKetersediaan: {
    type: String,
    required: true,
    enum: [ "AVAILABLE", "IN USE" ]
  },
  statusKendaraan: {
    type: String,
    required: true,
    enum: [ "SERVICE", "READY" ]
  },
  createdAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: Number,
    required: true
  }
}, {
  strict: true,
  id: false
} );

KendaraanSchema.index( {
  nomorKendaraan: "text",
  namaKendaraan: "text",
  jenisTransmisi: "text",
  jumlahKilometer: "text",
  tanggalTerakhirService: "text",
  statusKetersediaan: "text",
  statusKendaraan: "text"
}, {
  name: "default"
} );
export default mongoose.model( "kendaraan_data", KendaraanSchema );