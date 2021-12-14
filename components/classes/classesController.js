const mongoose = require("mongoose")
const classesService = require("./classesService")
const userService = require("../User/userService")

exports.getClassList = async (req, res, next) => {
  const _id = req.user._id
  const result = await classesService.getClassList(_id)
  res.json(result)
}

exports.getClass = async (req, res, next) => {
  const result = await classesService.getClassInfo(req.params.id)
  res.json(result)
}

exports.createClass = async (req, res, next) => {
  const userId = req.user._id
  const data = { ...req.body, _id: userId }
  const newClass = await classesService.createNewClass(data)
  const userInfo = await userService.getUser(userId)
  await classesService.addTeacherToClass(
    newClass._id,
    userId,
    userInfo.username,
    userInfo.email
  )
  const updateData = {
    creator: mongoose.Types.ObjectId(userId),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: newClass._id.toString(),
  }
  //console.log("modify")

  await classesService.classModify({ updateData })
  const newClassList = await classesService.getClassList(userId)

  res.json(newClassList)
}

exports.getListOfTeachers = async (req, res, next) => {
  const listOfTeachers = await classesService.getListOfTeachers(req.params.id)
  res.json(listOfTeachers)
}

exports.getListOfStudents = async (req, res, next) => {
  const listOfTeachers = await classesService.getListOfStudents(req.params.id)
  res.json(listOfTeachers)
}
