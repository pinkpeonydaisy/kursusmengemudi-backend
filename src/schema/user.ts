import mongoose from "mongoose";
import { User } from "../..";

const UserModel = new mongoose.Schema<User>( {
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true
  },
  tipe_user: {
    type: String,
    required: true,
    enum: [ "OWNER", "ADMIN" ]
  },
  created_at: {
    type: Date,
    required: true
  },
  created_by: {
    type: Number,
    required: true
  }
}, {
  strict: true
} );
UserModel.index( {
  username: "text"
}, {
  name: "default"
} );

export default mongoose.model( "user_data", UserModel);
