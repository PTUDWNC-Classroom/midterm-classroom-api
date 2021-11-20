const classesModel = require("./classesModel")
const mongoose = require("mongoose")

exports.getClassList = async () => {
  return await classesModel.Classes.find({}).sort([["createdDate", -1]])
}

exports.getClassInfo = async (classId) => {
  return await classesModel.Classes.findById(classId)
}

exports.createNewClass = async (data) => {
  const classInfo = {
    //creator: mongoose.Types.ObjectId(data.),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: "invite-code",
  }
  const newClass = new classesModel.Classes(classInfo)

  await newClass.save()

  return newClass._id
}

exports.getListOfTeachers = async (classId) => {
  return await classesModel.TeachersOfClass.find({
    classId: mongoose.Types.ObjectId(classId),
  })
}

exports.getListOfStudents = async (classId) => {
  return await classesModel.StudentsOfClass.find({
    classId: mongoose.Types.ObjectId(classId),
  })
}
