import joi from "joi";

export const createAdminKursus = joi.object( {
  username: joi.string().min( 3 ).max( 20 ).required(),
  password: joi.string().min( 8 ).pattern( new RegExp( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ ) ).required(),
} );

export const UpdateAdmin = joi.object( {
  username: joi.string().min( 3 ).max( 20 ),
  password: joi.string().min( 8 ).pattern( new RegExp( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ ) ),
} );

