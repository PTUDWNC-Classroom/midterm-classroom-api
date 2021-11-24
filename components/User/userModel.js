const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  studentId: { type: String },
})

module.exports = mongoose.model("users", userSchema)
