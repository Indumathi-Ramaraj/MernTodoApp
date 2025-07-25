const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    max: 32,
    unique: true,
    lowercase: true,
  },
  phone_number: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  createdAt: { type: Date, default: Date.now },
});

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
