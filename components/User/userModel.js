const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String },
  email: { type: String, require: true },
  studentId: { type: String, default: "" },
})

module.exports = mongoose.model("users", userSchema)
