const classesModel = require("./classesModel")
const mongoose = require("mongoose")

exports.getClassList = async (_id) => {
  return await classesModel.Classes.find({creator: _id}).sort([["createdDate", -1]])
}

exports.getClassInfo = async (classId) => {
  return await classesModel.Classes.findById(classId)
}

exports.createNewClass = async (data) => {
  const classInfo = {
    creator: mongoose.Types.ObjectId(data._id),
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

exports.classModify = async ({ updateData }) => {
  console.log("update")
  console.log(updateData.inviteCode)
  // const a = await classesModel.findByIdAndUpdate(
  //   query,
  //   {
  //     className: updateData.className,
  //     section: updateData.section,
  //     subject: updateData.subject,
  //     room: updateData.room,
  //     inviteCode: updateData.inviteCode,
  //   }
  // )
  const a = await classesModel.Classes.findOneAndUpdate(
    {_id: updateData.inviteCode, className: updateData.className}, 
    {
    creator: updateData.creator,
    className: updateData.className,
    section: updateData.section,
    subject: updateData.subject,
    room: updateData.room,
    inviteCode: updateData.inviteCode,
  })

  console.log(a)
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
