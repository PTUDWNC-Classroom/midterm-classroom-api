const classesService = require('./classesService');

exports.getClassList = async (req, res, next) => {
  const result = await classesService.getClassList();
  res.json(result);
}

exports.getClass = async (req, res, next) => {
  const result = await classesService.getClassInfo(req.params.id);
  res.json(result);
}

exports.createClass = async (req, res, next) => {
  const newClassId = await classesService.createNewClass(req.body);
  res.json(newClassId);
}