import { ObjectId } from "mongoose";

export interface DefaultResponse {
  status: number;
  valid: boolean;
  message: string;
  code: string;
  data: any | null;
}
export interface User {
  _id: ObjectId
  id: string,
  user_id: number,
  username: string,
  password_hash: string,
  tipe_user: "ADMIN" | "OWNER",
  created_at: Date,
  created_by: number,
}
export interface Instruktur {
  nikInstruktur: string,
  namaLengkap: string,
  alamatInstruktur: string,
  noTelp: string,
  noRekening: string,
  createdAt: Date,
  createdBy: number,
}
export interface KelasMengemudi {
  _id: ObjectId
  kelasMengemudiID: number,
  namaKelas: string,
  hargaKelas: number,
  jenisKendaraan: "MATIC" | "MANUAL",
  totalJamKursus: number,
  jumlahSesi: number,
  platNomorKendaraan: string,
  namaKendaraan: string,
  createdAt: Date,
  createdBy: number,
}
export interface Kendaraan {
  nomorKendaraan: string,
  namaKendaraan: string,
  jenisTransmisi: "MATIC" | "MANUAL",
  jumlahKilometer: number,
  tanggalTerakhirService: Date,
  statusKetersediaan: "AVAILABLE" | "IN USE",
  statusKendaraan: "SERVICE" | "READY",
  createdAt: Date,
  createdBy: number,
}
export interface CalonPelanggan {
  _id: ObjectId
  id: string,
  calonPelangganID: number,
  nama: string,
  kelasPelanggan: number,
  umur: number,
  noWA: string,
  alamat: string,
  statusPelanggan: "Calon" | "Siswa" | "Lulus",
  adminKursus: number,
  tanggalPendaftaran: Date
}
