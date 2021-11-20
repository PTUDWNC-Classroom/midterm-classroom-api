const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
  email: { type: String, require: true },
  userName: { type: String, require: true },
  passWord: { type: String, require: true },
  listClasses: Array,
})

module.exports = mongoose.model("users", usersSchema)
