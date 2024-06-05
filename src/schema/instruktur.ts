import mongoose from "mongoose";
import { Instruktur } from "../..";
const stringRequired = {
  type: String,
  required: true
};
const InstrukturSchema = new mongoose.Schema<Instruktur>( {
  nikInstruktur: {
    type: String,
    required: true,
    unique: true
  },
  namaLengkap: stringRequired,
  alamatInstruktur: stringRequired,
  noTelp: stringRequired,
  noRekening: stringRequired,
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

InstrukturSchema.index( {
  nikInstruktur: "text",
  namaLengkap: "text",
  alamatInstruktur: "text",
  noTelp: "text",
  noRekening: "text"
}, {
  name: "default"
} );
export default mongoose.model( "instruktur_data", InstrukturSchema );