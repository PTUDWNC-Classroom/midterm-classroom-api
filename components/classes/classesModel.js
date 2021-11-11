const mongoose = require('mongoose');

const classesSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, require: true },
  className: { type: String, require: true },
  section: { type: String },
  subject: { type: String },
  room: { type: String },
  createdDate: { type: Date, default: Date.now() },
  inviteCode: { type: String, require: true },
  memberTotal: { type: Number, default: 0 },
})

module.exports = mongoose.model('classes', classesSchema)