const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, require: true },
    userId: { type: mongoose.Schema.Types.ObjectId, require: true },
    gradeTitle: { type: String },
    gradeDetail: { type: String },
    disableState: {type: Boolean},
    indexAssignment: {type: Number}
})

module.exports = mongoose.model("gradeAssignment", userSchema)