const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
  classId: { type: String, require: true },
  studentId: { type: String },
  title: {type: String},
  commentList: [
    {
      comment: { type: String },
      date: { type: Date},
      commentUser: {type: String},
    },
  ],
})

module.exports = mongoose.model("reviews", reviewSchema)