const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: Schema.Types.ObjectId, ref: "Carts" },
  role: { type: String, default: "user" },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
