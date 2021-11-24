const mongoose = require("mongoose")
const classesService = require("./classesService")
const userService = require("../User/userService")

exports.getClassList = async (req, res, next) => {
  //console.log("getClassList", req.body)
  const _id = req.body
  //console.log(_id)
  const result = await classesService.getClassList(_id)
  //console.log("result")
  res.json(result)
}

exports.getClass = async (req, res, next) => {
  const result = await classesService.getClassInfo(req.params.id)
  res.json(result)
}

exports.createClass = async (req, res, next) => {
  //console.log("createClass")
  const data = req.body
  //console.log(data)
  const newClassId = await classesService.createNewClass(data)
  const userInfo = await userService.getUser(data._id)
  await classesService.addTeacherToClass(
    newClassId,
    data._id,
    userInfo.username,
    userInfo.email
  )
  const updateData = {
    creator: mongoose.Types.ObjectId(data._id),
    className: data.className,
    section: data.section,
    subject: data.subject,
    room: data.room,
    inviteCode: newClassId.toString(),
  }
  //console.log("modify")

  await classesService.classModify({ updateData })

  res.json(newClassId)
}

exports.getListOfTeachers = async (req, res, next) => {
  const listOfTeachers = await classesService.getListOfTeachers(req.params.id)
  res.json(listOfTeachers)
}

exports.getListOfStudents = async (req, res, next) => {
  const listOfTeachers = await classesService.getListOfStudents(req.params.id)
  res.json(listOfTeachers)
}
