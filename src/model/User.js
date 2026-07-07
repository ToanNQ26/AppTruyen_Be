import mongoose from "mongoose";

// console.trace("User.js loaded");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {type: String, enum: ['admin', 'uploader', 'user'], default: 'user', required: true},
    followingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// console.log("Loading User.js");
// console.log("Models:", mongoose.modelNames());

const Users = mongoose.model("User", userSchema);

export default Users;
