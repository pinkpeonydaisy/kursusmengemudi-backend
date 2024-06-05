import joi from "joi";
export const CreateKelasMengemudi = joi.object( {
  namaKelas: joi.string().min(1).required(),
  hargaKelas: joi.number().integer().greater(1).required(),
  jumlahSesi: joi.number().integer().greater(0).required(),
  platNomorKendaraan: joi.string().min(3).required(),
} );
export const UpdateKelasMengemudi = joi.object( {
  namaKelas: joi.string().min( 1 ),
  hargaKelas: joi.number().integer().greater(1),
  jumlahSesi: joi.number().integer().greater(0),
  platNomorKendaraan: joi.string().min(4),
} );
