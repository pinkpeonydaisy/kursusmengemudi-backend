import mongoose from "mongoose";
import { KelasMengemudi } from "../..";
const stringRequired = {
  type: String,
  required: true
};
const KelasMengemudiSchema = new mongoose.Schema<KelasMengemudi>( {
  kelasMengemudiID: {
    type: Number,
    required: true,
    unique: true
  },
  namaKelas: {
    type: String,
    required: true,
    unique: true
  },
  hargaKelas: {
    type: Number,
    required: true
  },
  jenisKendaraan: {
    type: String,
    required: true,
    enum: [ "MATIC", "MANUAL" ]
  },
  totalJamKursus: {
    type: Number,
    required: true
  },
  jumlahSesi: {
    type: Number,
    required: true
  },
  platNomorKendaraan: stringRequired,
  namaKendaraan: stringRequired,
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

KelasMengemudiSchema.index( {
  kelasMengemudiID: "text",
  namaKelas: "text",
  hargaKelas: "text",
  jenisKendaraan: "text",
  totalJamKursus: "text",
  jumlahSesi: "text",
  platNomorKendaraan: "text",
  namaKendaraan: "text"
}, {
  name: "default"
} );
export default mongoose.model( "kelasmengemudi_data", KelasMengemudiSchema );
