import joi from "joi";
export const CreateKendaraan = joi.object( {
  nomorKendaraan: joi.string().min( 4 ).required(),
  namaKendaraan: joi.string().min( 3 ).required(),
  jenisTransmisi: joi.string().valid( "MATIC", "MANUAL" ).required(),
  jumlahKilometer: joi.number().required(),
  tanggalTerakhirService: joi.date().required(),
  statusKetersediaan: joi.string().valid( "AVAILABLE", "IN USE" ).required(),
  statusKendaraan: joi.string().valid( "SERVICE", "READY" ).required(),
} );
export const UpdateKendaraan = joi.object( {
  jumlahKilometer: joi.number().required(),
  tanggalTerakhirService: joi.date().required(),
  statusKetersediaan: joi.string().valid( "AVAILABLE", "IN USE" ).required(),
  statusKendaraan: joi.string().valid( "SERVICE", "READY" ).required(),
} );