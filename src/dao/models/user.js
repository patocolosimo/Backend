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
  role: { type: String, enum: ["user", "premium", "admin"], default: "user" }, // Se añaden los roles "premium" y "admin"
  createdProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Relación con los productos creados por el usuario
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
