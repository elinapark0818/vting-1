"use strict";
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const saltRounds = 6
// const UserSchema = new mongoose.Schema({
//   user_id: {
//     type: String,
//     trim: true,
//     required: true,
//     unique:1
//   },
//   password: {
//     type: String,
//     required: true,
//     min:5
//   },
//   nickname: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: false,
//   },
//   vote: {
//     type: Array,
//     required: false,
//   },
// });
// UserSchema.pre("save", function (next) {
//     var user = this
//   if (!this.isModified("password")) return next();
//   bcrypt.hash(this.password, 6, (err, passwordHash) => {
//     if (err) return next(err);
//     this.password = passwordHash;
//     next();
//   });
// });
// UserSchema.methods.comparePassword = function (password, cb) {
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     if (err) return cb(err);
//     else if (!isMatch) return cb(null, isMatch);
//     return cb(null, this);
//   });
// };
