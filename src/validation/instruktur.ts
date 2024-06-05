import joi from "joi";
export const CreateInstruktur = joi.object( {
  nikInstruktur: joi.string().pattern(/^\d{16}$/).required(),
  namaLengkap: joi.string().min( 3 ).required(),
  alamatInstruktur: joi.string().required(),
  noTelp: joi.string().pattern(/^(\+62|62|0)(\d{9,12})$/).required(),
  noRekening: joi.string().pattern(/^\d{8}$/).required(),
} );
export const UpdateInstruktur = joi.object( {
  namaLengkap: joi.string().min( 3 ),
  alamatInstruktur: joi.string(),
  noTelp: joi.string().pattern(/^(\+62|62|0)(\d{9,12})$/),
  noRekening: joi.string().pattern(/^\d{8}$/),
} );