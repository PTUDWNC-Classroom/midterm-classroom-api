const classesService = require("./classesService")

exports.getClassList = async (req, res, next) => {
  const result = await classesService.getClassList()
  res.json(result)
}

exports.getClass = async (req, res, next) => {
  const result = await classesService.getClassInfo(req.params.id)
  res.json(result)
}

exports.createClass = async (req, res, next) => {
  const newClassId = await classesService.createNewClass(req.body)
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
