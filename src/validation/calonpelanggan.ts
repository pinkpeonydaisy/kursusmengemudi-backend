import joi from "joi";
export const CreateCalonPelanggan = joi.object( {
  nama: joi.string().min( 3 ).pattern(/^[A-Za-z-]+$/).required(),
  kelasPelanggan: joi.number(),
  umur: joi.number().min( 15 ).max( 100 ).required(),
  noWA: joi.string().pattern(/^(\+62|62|0)(\d{9,12})$/).required(),
  alamat: joi.string().required(),
  statusPelanggan: joi.string().valid("Calon", "Siswa", "Lulus").required(),
  adminKursus: joi.number()
} );
export const UpdateCalonPelanggan = joi.object( {
  nama: joi.string().pattern(/^[A-Za-z-]+$/).min( 3 ),
  kelasPelanggan: joi.number(),
  umur: joi.number().min( 15 ).max( 100 ),
  noWA: joi.string().pattern(/^(\+62|62|0)(\d{9,12})$/),
  alamat: joi.string(),
  statusPelanggan: joi.string().valid("Calon", "Siswa", "Lulus"),
  adminKursus: joi.number()
} );