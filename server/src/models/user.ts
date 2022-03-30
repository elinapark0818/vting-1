import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  user_id: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: false,
  },
  vote: {
    type: Array,
    required: false,
  },
});

const model = mongoose.model("user", userSchema);
