import joi from "joi";

export const Description = joi.object( {
  description: joi.string().min( 10 ).max( 500 ).required()
} );
export const Faq = joi.object( {
  question: joi.string().min(10).required(),
  answer: joi.string().min(10).required()
} );
export const UpdateFaq = joi.object( {
  question: joi.string().min(10),
  answer: joi.string().min(10)
} );
